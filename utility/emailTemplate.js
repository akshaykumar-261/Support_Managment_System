const mailOptions = {
   from: process.env.EMAIL_USER,
   to: agent.email,
   subject: "New Ticket Assigned",

   html: `
      <h2>Hello ${agent.name}</h2>

      <p>A new support ticket has been assigned to you.</p>

      <h3>Ticket Details</h3>

      <ul>
         <li><b>Ticket Number:</b> ${ticket.ticket_number}</li>
         <li><b>Title:</b> ${ticket.title}</li>
         <li><b>Priority:</b> ${ticket.priority}</li>
         <li><b>Status:</b> ${ticket.status}</li>
      </ul>

      <h3>Customer Information</h3>

      <ul>
         <li><b>Name:</b> ${customer.name}</li>
         <li><b>Email:</b> ${customer.email}</li>
      </ul>

      <p>Please review and resolve the issue.</p>

      <br>

      <p>Support Management Team</p>
   `
};