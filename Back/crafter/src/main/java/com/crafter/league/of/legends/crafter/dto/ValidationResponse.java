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
public class ValidationResponse {

    private boolean correct;
    private List<String> correctComponentIds;
    private List<String> correctComponentNames;
    private List<ItemOption> correctComponents;
    private List<String> incorrectComponentIds;
    private String message;
    private Integer scorePoints;
}
