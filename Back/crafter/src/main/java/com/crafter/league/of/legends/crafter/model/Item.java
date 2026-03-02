package com.crafter.league.of.legends.crafter.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Item {
    private String id;
    private String name;
    private String description;
    private Map<String, Object> gold;
    private List<String> from;  // Componentes necesarios para craftear este item
    private List<String> into;  // Items que pueden craftearse desde este
    private Map<String, Object> image;
    private Map<String, Object> stats;
    private List<String> tags;


    // Campos calculados
    private Integer totalCost;
    private String imageUrl;

    public Integer getTotalCost() {
        if (totalCost != null) {
            return totalCost;
        }
        if (gold != null && gold.containsKey("total")) {
            return ((Number) gold.get("total")).intValue();
        }
        return 0;
    }

    public String getImageUrl() {
        if (imageUrl != null) {
            return imageUrl;
        }
        if (image != null && image.containsKey("full")) {
            return (String) image.get("full");
        }
        return null;
    }

    public boolean isCraftableItem() {
        // Un item es crafteable si tiene componentes (from)
        return from != null && !from.isEmpty();
    }

    public int getComponentCount() {
        return (from != null) ? from.size() : 0;
    }
}
