package com.synapseflow.controller;

import com.synapseflow.dto.TaskRequest;
import com.synapseflow.entity.Task;
import com.synapseflow.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

   @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request, java.security.Principal principal) {
        // principal.getName() securely grabs the email of the currently logged-in user!
        Task createdTask = taskService.createTask(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }
    @GetMapping
    public ResponseEntity<List<Task>> getMyTasks(Principal principal) {
        // principal.getName() gets the email of the logged-in user from the JWT token
        List<Task> tasks = taskService.getMyTasks(principal.getName());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Task>> getTasksByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Task> tasks = taskService.getTasksByUserId(userId, page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long taskId) {
        Task task = taskService.getTaskById(taskId);
        return ResponseEntity.ok(task);
    }

     

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskRequest request,
            Principal principal) { // <-- 1. Inject the logged-in user
        
        // 2. Pass the username to the service layer
        Task updatedTask = taskService.updateTask(taskId, request, principal.getName());
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            Principal principal) { // <-- 1. Inject the logged-in user
        
        // 2. Pass the username to the service layer
        taskService.deleteTask(taskId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}