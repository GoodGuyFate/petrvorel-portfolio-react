import { useState } from 'react'

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit() {
    if (!name || !email || !message) {
      alert('Please fill in all fields')
      return
    }
    console.log('Contact form submitted:', { name, email, message })
    alert("Thanks for your message! Petr will be in touch soon.")
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="contact-form">
      <p className="contact-intro">Get in touch</p>
      <div className="form-group">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="Your Message"
          rows="5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button className='contact-send-btn' onClick={handleSubmit}>Send</button>
    </div>
  )
}

export default ContactForm