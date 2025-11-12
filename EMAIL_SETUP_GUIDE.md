# 📧 EmailJS Setup Guide - Contact Form

## ✅ Changes Completed:

### **Form Updates:**
1. ✅ **Téléphone** is now **MANDATORY** (required field with red asterisk)
2. ✅ **Budget** field **REMOVED** completely from the form
3. ✅ **Localisation** field **ADDED** (required text field for location)
4. ✅ **Email integration** ready to send to: **maher.messeoudi@gmail.com**

---

## 📋 New Form Fields:

### **Required Fields (*)**
1. **Prénom** (First Name)
2. **Nom** (Last Name)
3. **Email**
4. **Téléphone** ⭐ NOW REQUIRED
5. **Type de Projet** (Project Type dropdown)
6. **Localisation** ⭐ NEW FIELD (ex: Alger, Oran, Constantine...)
7. **Message** (Project description)
8. **Consent** checkbox

### **Removed:**
- ❌ Budget field (completely removed)

---

## 🚀 EmailJS Setup Instructions

To make the email functionality work, you need to set up EmailJS (free service):

### **Step 1: Create EmailJS Account**

1. Go to: **https://www.emailjs.com/**
2. Click **"Sign Up"** and create a free account
3. Confirm your email address

---

### **Step 2: Add Email Service**

1. Once logged in, go to **"Email Services"** in the sidebar
2. Click **"Add New Service"**
3. Choose your email provider (Gmail recommended):
   - **Gmail** (easiest option)
   - Or Outlook, Yahoo, etc.
4. Click **"Connect Account"**
5. Sign in with your **maher.messeoudi@gmail.com** account
6. Give your service a name (e.g., "Contact Form")
7. Copy the **Service ID** (you'll need this later)
8. Click **"Create Service"**

---

### **Step 3: Create Email Template**

1. Go to **"Email Templates"** in the sidebar
2. Click **"Create New Template"**
3. Set up your template with this format:

#### **Template Name:** 
```
contact_form_studio_design
```

#### **Subject Line:**
```
Nouveau Message de Contact - {{from_name}}
```

#### **Email Content (HTML):**
```html
<h2>Nouveau Message de Contact</h2>

<p><strong>De:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Téléphone:</strong> {{phone}}</p>
<p><strong>Type de Projet:</strong> {{project_type}}</p>
<p><strong>Localisation:</strong> {{localisation}}</p>

<h3>Message:</h3>
<p>{{message}}</p>

<hr>
<p><em>Ce message a été envoyé depuis le formulaire de contact du site MJ Studio Design.</em></p>
```

4. In the **"To Email"** field, enter: **maher.messeoudi@gmail.com**
5. Copy the **Template ID** (you'll need this later)
6. Click **"Save"**

---

### **Step 4: Get Your Public Key**

1. Go to **"Account"** in the sidebar
2. Click on **"General"** or **"API Keys"**
3. Copy your **Public Key** (it looks like: `YOUR_PUBLIC_KEY`)

---

### **Step 5: Update Your Website Code**

Now you have 3 pieces of information:
- **Public Key**
- **Service ID**
- **Template ID**

#### **Update `contact.html`:**

Find this line (around line 377):
```javascript
emailjs.init("YOUR_PUBLIC_KEY"); // REPLACE WITH YOUR EMAILJS PUBLIC KEY
```

Replace `YOUR_PUBLIC_KEY` with your actual public key:
```javascript
emailjs.init("abc123def456ghi789"); // Example
```

#### **Update `js/contact.js`:**

Find this line (around line 45):
```javascript
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

Replace with your actual IDs:
```javascript
emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

---

## 📝 Example Configuration:

### **In `contact.html` (line 377):**
```javascript
emailjs.init("uY8xK2mNzLpQ4sR7v"); // Your actual public key
```

### **In `js/contact.js` (line 45):**
```javascript
emailjs.send('service_mjstudio', 'contact_form_studio_design', templateParams)
```

---

## ✅ Testing Your Form:

1. Open your website: `http://localhost:8000/contact.html`
2. Fill out the contact form with test data
3. Click **"Envoyer le Message"**
4. Check **maher.messeoudi@gmail.com** for the email
5. You should receive an email with all the form information!

---

## 📧 Email Content You'll Receive:

When someone submits the form, you'll receive an email like this:

```
Subject: Nouveau Message de Contact - John Doe

Nouveau Message de Contact

De: John Doe
Email: john.doe@example.com
Téléphone: +213 555 123 456
Type de Projet: Résidentiel
Localisation: Alger

Message:
Bonjour, je souhaite rénover mon appartement...

---
Ce message a été envoyé depuis le formulaire de contact du site MJ Studio Design.
```

---

## 🔒 Security Notes:

1. **Public Key is Safe**: The public key is meant to be visible in your frontend code
2. **Free Tier Limits**: EmailJS free tier allows 200 emails/month
3. **Spam Protection**: EmailJS has built-in spam protection
4. **Upgrade if needed**: If you need more emails, upgrade to a paid plan

---

## 🎯 What Happens When Form is Submitted:

1. ✅ Form validates all required fields (including phone & localisation)
2. ✅ Shows "Envoi en cours..." (Sending...)
3. ✅ Sends email to **maher.messeoudi@gmail.com** via EmailJS
4. ✅ Shows success message to customer
5. ✅ Form resets after 5 seconds
6. ✅ If error occurs, shows error message

---

## 🆘 Troubleshooting:

### **Email not sending?**
1. Check browser console (F12) for errors
2. Verify all 3 IDs are correct (Public Key, Service ID, Template ID)
3. Make sure you're connected to the internet
4. Check EmailJS dashboard for error logs

### **Getting "Unauthorized" error?**
- Double-check your Public Key is correct
- Make sure you initialized EmailJS properly

### **Template not found?**
- Verify your Template ID matches exactly
- Check the template is active in EmailJS dashboard

### **Gmail blocking?**
- Make sure you've connected Gmail properly in EmailJS
- Check your Gmail security settings

---

## 📱 Form Fields Summary:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Prénom | Text | ✅ Yes | First Name |
| Nom | Text | ✅ Yes | Last Name |
| Email | Email | ✅ Yes | Customer email |
| Téléphone | Tel | ✅ Yes | Phone (now mandatory) |
| Type de Projet | Dropdown | ✅ Yes | Résidentiel/Commercial/Bureau/Restaurant/Autre |
| Localisation | Text | ✅ Yes | Location (NEW field) |
| Message | Textarea | ✅ Yes | Project description |
| Consent | Checkbox | ✅ Yes | Privacy policy agreement |

---

## ✨ All Done!

Once you complete the EmailJS setup, your contact form will automatically send emails to **maher.messeoudi@gmail.com** with all the customer information!

**Need help?** Check EmailJS documentation: https://www.emailjs.com/docs/

---

**Your contact form is now ready with all the requested changes!** 🎉

