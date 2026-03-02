package com.crafter.league.of.legends.crafter.service;

import com.crafter.league.of.legends.crafter.model.Item;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemService {

    private final DataDragonService dataDragonService;

    public Map<String, Item> getAllItems() {
        return dataDragonService.fetchAllItems();
    }

    public Map<String, Item> getCraftableItems() {
        return dataDragonService.fetchCraftableItems();
    }

    public Optional<Item> getItemById(String itemId) {
        Map<String, Item> allItems = getAllItems();
        return Optional.ofNullable(allItems.get(itemId));
    }

    public boolean isValidCraftingCombination(String targetItemId, java.util.List<String> componentIds) {
        Optional<Item> targetItem = getItemById(targetItemId);

        if (targetItem.isEmpty() || !targetItem.get().isCraftableItem()) {
            log.warn("Target item {} is not craftable", targetItemId);
            return false;
        }

        java.util.List<String> correctComponents = targetItem.get().getFrom();

        log.info("🔍 VALIDACIÓN - Target: {}", targetItemId);
        log.info("🔍 Componentes CORRECTOS del backend: {}", correctComponents);
        log.info("🔍 Componentes SELECCIONADOS por usuario: {}", componentIds);

        // Verificar que tengan el mismo tamaño
        if (componentIds.size() != correctComponents.size()) {
            log.warn("⚠️ Tamaño diferente: {} vs {}", componentIds.size(), correctComponents.size());
            return false;
        }

        // Verificar que todos los componentes seleccionados estén en la lista correcta
        boolean containsAll1 = componentIds.containsAll(correctComponents);
        boolean containsAll2 = correctComponents.containsAll(componentIds);

        log.info("🔍 componentIds.containsAll(correctComponents): {}", containsAll1);
        log.info("🔍 correctComponents.containsAll(componentIds): {}", containsAll2);

        boolean isValid = containsAll1 && containsAll2;
        log.info("🔍 Resultado final: {}", isValid ? "✅ CORRECTO" : "❌ INCORRECTO");

        return isValid;
    }
}
