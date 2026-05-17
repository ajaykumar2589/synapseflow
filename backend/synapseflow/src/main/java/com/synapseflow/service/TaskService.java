package com.synapseflow.service;

import com.synapseflow.dto.TaskRequest;
import com.synapseflow.entity.Task;
import com.synapseflow.entity.User;
import com.synapseflow.repository.TaskRepository;
import com.synapseflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.synapseflow.exception.ResourceNotFoundException;


@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

     @Transactional
    public Task createTask(TaskRequest request, String userEmail) {
        // Securely look up the user by the email stored in the token
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Secure user context not found"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .dueDate(request.getDueDate())
                .user(user) // Securely attach the task to the verified user
                .build();

        return taskRepository.save(task);
    }
@Transactional(readOnly = true)
    public List<Task> getMyTasks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return taskRepository.findByUserId(user.getId());
    }
    @Transactional(readOnly = true)
    public Page<Task> getTasksByUserId(Long userId, int page, int size) {
        // Sort by due date ascending so the most urgent tasks appear first
        Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").ascending());
        return taskRepository.findByUserId(userId, pageable);
    }

    @Transactional(readOnly = true)
   public Task getTaskById(Long taskId) {
    return taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
}

    @Transactional
    public Task updateTask(Long taskId, TaskRequest request, String userEmail) {
        Task existingTask = getTaskById(taskId); 

        // --- SECURITY CHECK: IDOR PREVENTION ---
        // Verify that the email of the user assigned to this task matches the email in the JWT token
        if (!existingTask.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: You do not have permission to modify this task.");
        }

        // Update fields
        existingTask.setTitle(request.getTitle());
        existingTask.setDescription(request.getDescription());
        existingTask.setStatus(request.getStatus());
        existingTask.setDueDate(request.getDueDate());

        return taskRepository.save(existingTask);
    }

    @Transactional
    public void deleteTask(Long taskId, String userEmail) {
        Task existingTask = getTaskById(taskId);

        // --- SECURITY CHECK: IDOR PREVENTION ---
        if (!existingTask.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: You do not have permission to delete this task.");
        }

        taskRepository.delete(existingTask);
    }
}