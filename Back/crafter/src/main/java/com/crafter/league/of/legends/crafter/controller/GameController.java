package com.crafter.league.of.legends.crafter.controller;



import com.crafter.league.of.legends.crafter.dto.GameQuestion;
import com.crafter.league.of.legends.crafter.dto.ValidationRequest;
import com.crafter.league.of.legends.crafter.dto.ValidationResponse;
import com.crafter.league.of.legends.crafter.service.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping("/question")
    public ResponseEntity<GameQuestion> getQuestion(
            @RequestParam(required = false, defaultValue = "MEDIUM") String difficulty) {
        log.info("GET /api/game/question?difficulty={}", difficulty);

        try {
            GameQuestion question = gameService.generateQuestion(difficulty);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            log.error("Error generating question", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<ValidationResponse> validateAnswer(
            @Valid @RequestBody ValidationRequest request) {
        log.info("POST /api/game/validate - Target: {}, Selected: {}",
                request.getTargetItemId(), request.getSelectedComponentIds());

        try {
            ValidationResponse response = gameService.validateAnswer(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error validating answer", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
