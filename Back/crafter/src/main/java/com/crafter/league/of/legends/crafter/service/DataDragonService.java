package com.crafter.league.of.legends.crafter.service;


import com.crafter.league.of.legends.crafter.config.CacheConfig;
import com.crafter.league.of.legends.crafter.model.Item;
import com.crafter.league.of.legends.crafter.model.ItemsData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataDragonService {

    private final WebClient webClient;

    @Value("${ddragon.version}")
    private String version;

    @Value("${ddragon.language}")
    private String language;

    @Value("${ddragon.base.url}")
    private String baseUrl;

    @Cacheable(value = CacheConfig.ITEMS_CACHE, key = "'all'")
    public Map<String, Item> fetchAllItems(){
        log.info("Fetching items from Data Dragon API - Version: {}, Language: {}", version, language);

        String url = String.format("/cdn/%s/data/%s/item.json", version, language);

        ItemsData itemsData = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ItemsData.class)
                .block();

        if (itemsData == null || itemsData.getData() == null) {
            log.error("Failed to fetch items from Data Dragon");
            throw new RuntimeException("Failed to fetch items from Data Dragon API");
        }

        // Enriquecer items con URLs completas de imágenes
        Map<String, Item> enrichedItems = itemsData.getData().entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            Item item = entry.getValue();
                            item.setId(entry.getKey());

                            // Construir URL completa de la imagen
                            if (item.getImage() != null && item.getImage().containsKey("full")) {
                                String imageName = (String) item.getImage().get("full");
                                String fullImageUrl = String.format("%s/cdn/%s/img/item/%s",
                                        baseUrl, version, imageName);
                                item.setImageUrl(fullImageUrl);
                            }

                            return item;
                        }
                ));

        log.info("Successfully fetched and cached {} items", enrichedItems.size());
        return enrichedItems;
    }

    @Cacheable(value = CacheConfig.CRAFTABLE_ITEMS_CACHE, key = "'craftable'")
    public Map<String, Item> fetchCraftableItems() {
        log.info("Filtering craftable items");

        Map<String, Item> allItems = fetchAllItems();

        Map<String, Item> craftableItems = allItems.entrySet().stream()
                .filter(entry -> {
                    Item item = entry.getValue();
                    // Un item es crafteable si tiene componentes (from) y no es un item básico
                    return item.getFrom() != null &&
                            !item.getFrom().isEmpty() &&
                            item.getTotalCost() > 0;
                })
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        log.info("Found {} craftable items out of {} total items",
                craftableItems.size(), allItems.size());

        return craftableItems;
    }
}
