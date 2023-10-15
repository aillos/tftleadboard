package com.aillos.tftleadboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/contact")
    public String showForm() {
        return "contact";
    }

    @PostMapping("/contact")
    public String submitForm(@RequestParam String name,
                             @RequestParam String email,
                             @RequestParam String message) {

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo("andreasssolli@gmail.com"); // Replace with your email or desired recipient
        mailMessage.setSubject("Contact Form Submission from " + name);
        mailMessage.setText("From: " + name + "\nEmail: " + email + "\nMessage: " + message);
        mailMessage.setFrom(email);

        mailSender.send(mailMessage);

        return "redirect:/contact?success";
    }
}
