package com.smartinventory.service;

import com.smartinventory.model.User;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendUserAccountEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(user.getEmail());
        message.setSubject("Your Inventra Account Information");

        message.setText(
                "Hello " + user.getFullName() + ",\n\n" +
                "Your Inventra account has been created by the admin.\n\n" +
                "Account Information:\n" +
                "Full Name: " + user.getFullName() + "\n" +
                "Username: " + user.getUsername() + "\n" +
                "Email: " + user.getEmail() + "\n" +
                "Password: " + user.getPassword() + "\n" +
                "Role: " + user.getRole() + "\n\n" +
                "You can login to the system and edit your information from the Profile page.\n\n" +
                "Inventra Smart Inventory"
        );

        mailSender.send(message);
    }
}