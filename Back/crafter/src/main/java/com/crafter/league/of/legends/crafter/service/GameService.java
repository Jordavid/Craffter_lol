package com.crafter.league.of.legends.crafter.service;

;
import com.crafter.league.of.legends.crafter.dto.GameQuestion;
import com.crafter.league.of.legends.crafter.dto.ItemOption;
import com.crafter.league.of.legends.crafter.dto.ValidationRequest;
import com.crafter.league.of.legends.crafter.dto.ValidationResponse;
import com.crafter.league.of.legends.crafter.model.Item;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameService {

    private final ItemService itemService;
    private final Random random = new Random();

    private static final int EASY_OPTIONS = 6;
    private static final int MEDIUM_OPTIONS = 10;
    private static final int HARD_OPTIONS = 14;

    private static final int EASY_TIME = 50;
    private static final int MEDIUM_TIME = 40;  // Aumentado para debug
    private static final int HARD_TIME = 30;

    public GameQuestion generateQuestion(String difficulty) {
        difficulty = difficulty != null ? difficulty.toUpperCase() : "MEDIUM";

        Map<String, Item> craftableItems = itemService.getCraftableItems();

        if (craftableItems.isEmpty()) {
            throw new RuntimeException("No craftable items available");
        }

        // Seleccionar un item aleatorio como objetivo
        List<Item> itemList = new ArrayList<>(craftableItems.values());
        Item targetItem = itemList.get(random.nextInt(itemList.size()));

        log.info("Generated question for item: {} ({})", targetItem.getName(), targetItem.getId());

        // Obtener componentes correctos
        List<String> correctComponentIds = targetItem.getFrom();

        // NUEVO: Crear lista completa de componentes correctos con todos los datos
        Map<String, Item> allItems = itemService.getAllItems();
        List<ItemOption> correctComponents = correctComponentIds.stream()
                .map(allItems::get)
                .filter(Objects::nonNull)
                .map(item -> ItemOption.builder()
                        .itemId(item.getId())
                        .name(item.getName())
                        .imageUrl(item.getImageUrl())
                        .cost(item.getTotalCost())
                        .build())
                .collect(Collectors.toList());

        log.info("Correct components for {}: {}", targetItem.getName(),
                correctComponents.stream()
                        .map(ItemOption::getName)
                        .collect(Collectors.joining(", ")));

        // Generar opciones (correctas + distractores)
        int totalOptions = getTotalOptions(difficulty);
        List<ItemOption> options = generateOptions(
                correctComponentIds,
                totalOptions,
                difficulty
        );

        return GameQuestion.builder()
                .targetItemId(targetItem.getId())
                .targetItemName(targetItem.getName())
                .targetItemImageUrl(targetItem.getImageUrl())
                .correctComponentIds(correctComponentIds)
                .correctComponents(correctComponents)
                .options(options)
                .timeLimit(getTimeLimit(difficulty))
                .difficulty(difficulty)
                .build();
    }

    public ValidationResponse validateAnswer(ValidationRequest request) {
        boolean isCorrect = itemService.isValidCraftingCombination(
                request.getTargetItemId(),
                request.getSelectedComponentIds()
        );

        Optional<Item> targetItem = itemService.getItemById(request.getTargetItemId());

        if (targetItem.isEmpty()) {
            return ValidationResponse.builder()
                    .correct(false)
                    .message("Invalid target item")
                    .scorePoints(0)
                    .build();
        }

        List<String> correctIds = targetItem.get().getFrom();
        List<String> correctNames = correctIds.stream()
                .map(id -> itemService.getItemById(id))
                .filter(Optional::isPresent)
                .map(opt -> opt.get().getName())
                .collect(Collectors.toList());

        // NUEVO: Crear lista completa de componentes correctos con todos los datos
        Map<String, Item> allItems = itemService.getAllItems();
        List<ItemOption> correctComponents = correctIds.stream()
                .map(allItems::get)
                .filter(Objects::nonNull)
                .map(item -> ItemOption.builder()
                        .itemId(item.getId())
                        .name(item.getName())
                        .imageUrl(item.getImageUrl())
                        .cost(item.getTotalCost())
                        .build())
                .collect(Collectors.toList());

        List<String> incorrectIds = request.getSelectedComponentIds().stream()
                .filter(id -> !correctIds.contains(id))
                .collect(Collectors.toList());

        int scorePoints = isCorrect ? calculateScore(correctIds.size()) : 0;
        String message = isCorrect ?
                "Â¡Correcto! +" + scorePoints + " puntos" :
                "Incorrecto. Los componentes correctos son: " + String.join(", ", correctNames);

        return ValidationResponse.builder()
                .correct(isCorrect)
                .correctComponentIds(correctIds)
                .correctComponentNames(correctNames)
                .correctComponents(correctComponents)
                .incorrectComponentIds(incorrectIds)
                .message(message)
                .scorePoints(scorePoints)
                .build();
    }

    private List<ItemOption> generateOptions(
            List<String> correctComponentIds,
            int totalOptions,
            String difficulty) {

        Set<String> addedIds = new HashSet<>(correctComponentIds);
        List<ItemOption> options = new ArrayList<>();
        Map<String, Item> allItems = itemService.getAllItems();

        // Agregar componentes correctos primero
        for (String componentId : correctComponentIds) {
            Item component = allItems.get(componentId);
            if (component != null) {
                options.add(ItemOption.builder()
                        .itemId(component.getId())
                        .name(component.getName())
                        .imageUrl(component.getImageUrl())
                        .cost(component.getTotalCost())
                        .build());
            }
        }

        int neededDistractors = totalOptions - options.size();

        if ("HARD".equals(difficulty)) {
            // Recopilar tags y rango de costos de los componentes correctos
            Set<String> correctTags = correctComponentIds.stream()
                    .map(allItems::get)
                    .filter(Objects::nonNull)
                    .flatMap(item -> item.getTags() != null ? item.getTags().stream() : java.util.stream.Stream.empty())
                    .collect(Collectors.toSet());

            int avgCost = (int) correctComponentIds.stream()
                    .map(allItems::get)
                    .filter(Objects::nonNull)
                    .mapToInt(Item::getTotalCost)
                    .average()
                    .orElse(1000);

            int costMin = (int) (avgCost * 0.5);
            int costMax = (int) (avgCost * 2.0);

            // 1ª pasada: distractores que comparten tag Y rango de costo (los más engañosos)
            List<Item> smartDistractors = allItems.values().stream()
                    .filter(item -> !addedIds.contains(item.getId()))
                    .filter(item -> item.getTotalCost() >= costMin && item.getTotalCost() <= costMax)
                    .filter(item -> item.getTags() != null &&
                            !Collections.disjoint(item.getTags(), correctTags))
                    .collect(Collectors.toList());
            Collections.shuffle(smartDistractors);

            for (Item d : smartDistractors) {
                if (options.size() >= totalOptions) break;
                options.add(toOption(d));
                addedIds.add(d.getId());
            }

            // 2ª pasada: si faltan, completar con items de rango de costo similar
            if (options.size() < totalOptions) {
                List<Item> costDistractors = allItems.values().stream()
                        .filter(item -> !addedIds.contains(item.getId()))
                        .filter(item -> item.getTotalCost() >= costMin && item.getTotalCost() <= costMax)
                        .collect(Collectors.toList());
                Collections.shuffle(costDistractors);
                for (Item d : costDistractors) {
                    if (options.size() >= totalOptions) break;
                    options.add(toOption(d));
                    addedIds.add(d.getId());
                }
            }
        }

        // Relleno final (EASY/MEDIUM o si no hubo suficientes distractores inteligentes)
        if (options.size() < totalOptions) {
            List<Item> fallback = allItems.values().stream()
                    .filter(item -> !addedIds.contains(item.getId()))
                    .filter(item -> item.getTotalCost() > 0)
                    .collect(Collectors.toList());
            Collections.shuffle(fallback);
            for (Item d : fallback) {
                if (options.size() >= totalOptions) break;
                options.add(toOption(d));
                addedIds.add(d.getId());
            }
        }

        Collections.shuffle(options);
        return options;
    }

    private ItemOption toOption(Item item) {
        return ItemOption.builder()
                .itemId(item.getId())
                .name(item.getName())
                .imageUrl(item.getImageUrl())
                .cost(item.getTotalCost())
                .build();
    }

    private int getTotalOptions(String difficulty) {
        return switch (difficulty) {
            case "EASY" -> EASY_OPTIONS;
            case "HARD" -> HARD_OPTIONS;
            default -> MEDIUM_OPTIONS;
        };
    }

    private int getTimeLimit(String difficulty) {
        return switch (difficulty) {
            case "EASY" -> EASY_TIME;
            case "HARD" -> HARD_TIME;
            default -> MEDIUM_TIME;
        };
    }

    private int calculateScore(int componentCount) {
        // Puntos base segÃºn cantidad de componentes
        int baseScore = componentCount * 50;

        // Bonus por complejidad
        if (componentCount >= 3) {
            baseScore += 100;
        } else if (componentCount == 2) {
            baseScore += 50;
        }

        return baseScore;
    }
}