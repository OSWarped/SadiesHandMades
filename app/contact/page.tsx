"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message sent:", formData);
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="container mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-[#5E35B1]">Contact Us</h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg text-gray-700 text-center mb-6">
          Have a question or custom order request? We’d love to hear from you!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          ></textarea>
          <button type="submit" className="w-full bg-[#5E35B1] text-white py-2 rounded-lg hover:bg-[#4527A0]">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
