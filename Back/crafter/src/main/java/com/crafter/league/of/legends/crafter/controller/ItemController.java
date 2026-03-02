package com.crafter.league.of.legends.crafter.controller;


import com.crafter.league.of.legends.crafter.model.Item;
import com.crafter.league.of.legends.crafter.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    public ResponseEntity<Map<String, Item>> getAllItems() {
        log.info("GET /api/items - Fetching all items");
        Map<String, Item> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/craftable")
    public ResponseEntity<Map<String, Item>> getCraftableItems() {
        log.info("GET /api/items/craftable - Fetching craftable items");
        Map<String, Item> craftableItems = itemService.getCraftableItems();
        return ResponseEntity.ok(craftableItems);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<Item> getItemById(@PathVariable String itemId) {
        log.info("GET /api/items/{} - Fetching item by ID", itemId);
        return itemService.getItemById(itemId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
