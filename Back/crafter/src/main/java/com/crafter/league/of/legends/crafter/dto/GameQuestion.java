package com.crafter.league.of.legends.crafter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameQuestion {

    private String targetItemId;
    private String targetItemName;
    private String targetItemImageUrl;
    private List<String> correctComponentIds;
    private List<ItemOption> correctComponents;
    private List<ItemOption> options;  // Incluye componentes correctos + distractores
    private Integer timeLimit;  // Tiempo en segundos
    private String difficulty;  // EASY, MEDIUM, HARD
}
