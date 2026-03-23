package com.codeverge.talentportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public boolean sendOTPEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@codeverge.com");
            message.setTo(to);
            message.setSubject("Codeverge Talent Portal - Login OTP");
            message.setText("Your OTP for login to Codeverge Talent Portal is: " + otp + 
                          "\n\nThis OTP will expire in 10 minutes." +
                          "\n\nIf you didn't request this OTP, please ignore this email.");
            
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean sendTestResultEmail(String to, String subject, String message) {
        try {
            // Check if message is HTML
            if (message.trim().startsWith("<!DOCTYPE html>") || message.trim().startsWith("<html>")) {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
                helper.setFrom("noreply@codeverge.com");
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(message, true);
                mailSender.send(mimeMessage);
            } else {
                SimpleMailMessage emailMessage = new SimpleMailMessage();
                emailMessage.setFrom("noreply@codeverge.com");
                emailMessage.setTo(to);
                emailMessage.setSubject(subject);
                emailMessage.setText(message);
                mailSender.send(emailMessage);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean sendTechnicalTestPassEmail(String to, String candidateName, Double percentageScore, Integer totalCorrect, Integer totalQuestions) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom("noreply@codeverge.com");
            helper.setTo(to);
            helper.setSubject("🎉 Congratulations! You've Passed the Technical Round - Codeverge Talent Portal");
            
            String emailText = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Congratulations - Codeverge Talent Portal</title>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }" +
                ".container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }" +
                ".header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 40px 30px; text-align: center; }" +
                ".header h1 { margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }" +
                ".header .emoji { font-size: 48px; margin-bottom: 15px; display: block; }" +
                ".content { padding: 40px 30px; }" +
                ".score-box { background: #f0f7ff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }" +
                ".score-value { font-size: 32px; font-weight: 700; color: #667eea; margin-bottom: 5px; }" +
                ".score-label { font-size: 14px; color: #6c757d; text-transform: uppercase; letter-spacing: 1px; }" +
                ".congratulations-box { background: linear-gradient(135deg, #28a745 0%%, #20c997 100%%); color: white; padding: 30px; border-radius: 8px; margin: 25px 0; text-align: center; }" +
                ".congratulations-box h2 { margin: 0 0 15px 0; font-size: 24px; font-weight: 600; }" +
                ".next-steps { background: #f8f9fa; border-left: 4px solid #667eea; padding: 25px; margin: 25px 0; border-radius: 0 8px 8px 0; }" +
                ".next-steps h3 { color: #667eea; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; }" +
                ".steps-list { list-style: none; padding: 0; margin: 0; }" +
                ".steps-list li { padding: 12px 0; border-bottom: 1px solid #e9ecef; display: flex; align-items: center; }" +
                ".steps-list li:last-child { border-bottom: none; }" +
                ".step-number { background: #667eea; color: white; width: 28px; height: 28px; border-radius: 50%%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 15px; flex-shrink: 0; }" +
                ".footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }" +
                ".footer p { margin: 0; color: #6c757d; font-size: 14px; }" +
                ".highlight { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0; color: #856404; }" +
                ".btn { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }" +
                "@media (max-width: 600px) { .container { margin: 10px; } .header, .content, .footer { padding: 25px 20px; } }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<span class='emoji'>🎉</span>" +
                "<h1>Congratulations!</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<p>We are thrilled to inform you that you have successfully passed the <strong>Technical Test</strong> round of the Codeverge Talent Portal selection process.</p>" +
                "<div class='score-box'>" +
                "<div class='score-value'>%d / %d</div>" +
                "<div class='score-label'>Your Assessment Score (%.1f%%)</div>" +
                "</div>" +
                "<div class='congratulations-box'>" +
                "<h2>✅ ELIGIBLE FOR NEXT ROUND: CODING ROUND</h2>" +
                "<p>Your performance in the technical assessment has qualified you for the third and final round - the Coding Round. This is your opportunity to showcase your programming skills and problem-solving abilities.</p>" +
                "</div>" +
                "<div class='next-steps'>" +
                "<h3>📝 Next Steps:</h3>" +
                "<ul class='steps-list'>" +
                "<li><span class='step-number'>1</span> Keep an eye on your email for the coding round invitation</li>" +
                "<li><span class='step-number'>2</span> Prepare for programming challenges and algorithms</li>" +
                "<li><span class='step-number'>3</span> Review data structures and problem-solving techniques</li>" +
                "</ul>" +
                "</div>" +
                "<div class='highlight'>" +
                "<p><strong>📬 Important:</strong> The coding round invitation will be sent to this email address shortly. Please ensure you check your inbox regularly (including spam folder).</p>" +
                "</div>" +
                "<p>🚀 We are excited to see your coding skills in action!</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Best regards,<br>The Codeverge Talent Portal Team</p>" +
                "<p style='font-size: 12px; color: #adb5bd; margin-top: 15px;'>This is an automated message. Please do not reply to this email.<br>For any queries, contact our support team at <a href='mailto:support@codeverge.com' style='color: #667eea;'>support@codeverge.com</a></p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>",
                
                candidateName,
                totalCorrect,
                totalQuestions,
                percentageScore
            );
            
            helper.setText(emailText, true);
            mailSender.send(mimeMessage);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean sendTechnicalTestFailEmail(String to, String candidateName, Double percentageScore, Integer totalCorrect, Integer totalQuestions) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom("noreply@codeverge.com");
            helper.setTo(to);
            helper.setSubject("Technical Test Results - Codeverge Talent Portal");
            
            String emailText = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Technical Test Results - Codeverge Talent Portal</title>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }" +
                ".container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }" +
                ".header { background: linear-gradient(135deg, #6c757d 0%%, #495057 100%%); color: white; padding: 40px 30px; text-align: center; }" +
                ".header h1 { margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }" +
                ".header .emoji { font-size: 48px; margin-bottom: 15px; display: block; }" +
                ".content { padding: 40px 30px; }" +
                ".score-box { background: #fff5f5; border: 2px solid #e53e3e; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }" +
                ".score-value { font-size: 32px; font-weight: 700; color: #e53e3e; margin-bottom: 5px; }" +
                ".score-label { font-size: 14px; color: #6c757d; text-transform: uppercase; letter-spacing: 1px; }" +
                ".result-box { background: linear-gradient(135deg, #ffc107 0%%, #fd7e14 100%%); color: white; padding: 30px; border-radius: 8px; margin: 25px 0; text-align: center; }" +
                ".result-box h2 { margin: 0 0 15px 0; font-size: 24px; font-weight: 600; }" +
                ".encouragement-box { background: #f8f9fa; border-left: 4px solid #ffc107; padding: 25px; margin: 25px 0; border-radius: 0 8px 8px 0; }" +
                ".encouragement-box h3 { color: #ffc107; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; }" +
                ".steps-list { list-style: none; padding: 0; margin: 0; }" +
                ".steps-list li { padding: 12px 0; border-bottom: 1px solid #e9ecef; display: flex; align-items: center; }" +
                ".steps-list li:last-child { border-bottom: none; }" +
                ".step-icon { color: #ffc107; margin-right: 15px; font-size: 18px; flex-shrink: 0; }" +
                ".footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }" +
                ".footer p { margin: 0; color: #6c757d; font-size: 14px; }" +
                ".highlight { background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 6px; padding: 15px; margin: 20px 0; color: #0c5460; }" +
                ".btn { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #ffc107 0%%, #fd7e14 100%%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }" +
                "@media (max-width: 600px) { .container { margin: 10px; } .header, .content, .footer { padding: 25px 20px; } }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<span class='emoji'>📚</span>" +
                "<h1>Technical Test Results</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<p>Thank you for participating in the <strong>Technical Test</strong> round of the Codeverge Talent Portal selection process.</p>" +
                "<div class='score-box'>" +
                "<div class='score-value'>%d / %d</div>" +
                "<div class='score-label'>Your Assessment Score (%.1f%%)</div>" +
                "</div>" +
                "<div class='result-box'>" +
                "<h2>❌ Unfortunately, you did not meet the minimum criteria to proceed to the next round.</h2>" +
                "<p>Don't be discouraged - this is a learning opportunity to grow and improve.</p>" +
                "</div>" +
                "<div class='encouragement-box'>" +
                "<h3>💪 We encourage you to:</h3>" +
                "<ul class='steps-list'>" +
                "<li><span class='step-icon'>📖</span> Continue practicing and improving your technical skills</li>" +
                "<li><span class='step-icon'>🎯</span> Review topics where you faced challenges</li>" +
                "<li><span class='step-icon'>🔄</span> Consider applying again in the future</li>" +
                "</ul>" +
                "</div>" +
                "<div class='highlight'>" +
                "<p><strong>💡 Remember:</strong> Every expert was once a beginner. Keep learning, keep growing, and don't give up on your goals!</p>" +
                "</div>" +
                "<p>We appreciate your effort and interest in Codeverge. We wish you the best in your future endeavors.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Best regards,<br>The Codeverge Talent Portal Team</p>" +
                "<p style='font-size: 12px; color: #adb5bd; margin-top: 15px;'>This is an automated message. Please do not reply to this email.<br>For any queries, contact our support team at <a href='mailto:support@codeverge.com' style='color: #6c757d;'>support@codeverge.com</a></p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>",
                
                candidateName,
                totalCorrect,
                totalQuestions,
                percentageScore
            );
            
            helper.setText(emailText, true);
            mailSender.send(mimeMessage);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendCodingCompletionEmail(String to, String candidateName) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom("noreply@codeverge.com");
            helper.setTo(to);
            helper.setSubject("Coding Assessment Completed - Codeverge Talent Portal");
            
            String emailText = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Coding Assessment Completed - Codeverge Talent Portal</title>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }" +
                ".container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }" +
                ".header { background: linear-gradient(135deg, #1e293b 0%%, #0f172a 100%%); color: white; padding: 40px 30px; text-align: center; }" +
                ".header h1 { margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }" +
                ".header .logo { color: #facc15; font-family: monospace; font-size: 24px; font-weight: bold; margin-bottom: 10px; display: block; }" +
                ".content { padding: 40px 30px; }" +
                ".success-icon { font-size: 48px; color: #10b981; margin-bottom: 20px; }" +
                ".status-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center; }" +
                ".status-card h2 { color: #166534; margin: 0 0 10px 0; font-size: 22px; }" +
                ".next-steps-info { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }" +
                ".next-steps-info h3 { color: #1e40af; margin: 0 0 10px 0; font-size: 18px; }" +
                ".footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }" +
                ".footer p { margin: 0; color: #6c757d; font-size: 14px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<span class='logo'>{cv}</span>" +
                "<h1>Assessment Completed</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<p>Congratulations! You have successfully completed the <strong>Coding Assessment</strong> round of the Codeverge Talent Portal.</p>" +
                "<div class='status-card'>" +
                "<div class='success-icon'>✅</div>" +
                "<h2>Submission Received</h2>" +
                "<p>Your code has been securely submitted and recorded for evaluation by our technical review team.</p>" +
                "</div>" +
                "<div class='next-steps-info'>" +
                "<h3>🚀 What happens next?</h3>" +
                "<p>Our team will now review your problem-solving approach, code quality, and test case performance. You will be further notified regarding the results and the next round of selection via this email.</p>" +
                "</div>" +
                "<p>Thank you for your participation and for showcasing your coding skills!</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Best regards,<br>The Codeverge Talent Portal Team</p>" +
                "<p style='font-size: 12px; color: #adb5bd; margin-top: 15px;'>This is an automated message. Please do not reply to this email.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>",
                candidateName
            );
            
            helper.setText(emailText, true);
            mailSender.send(mimeMessage);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
