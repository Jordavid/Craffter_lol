package com.crafter.league.of.legends.crafter.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidationRequest {

    @NotNull(message = "Target item ID cannot be null")
    private String targetItemId;

    @NotEmpty(message = "Selected components cannot be empty")
    private List<String> selectedComponentIds;
}
