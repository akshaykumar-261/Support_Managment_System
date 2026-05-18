const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("User Connected", socket.id);
        socket.on("join_ticket", (ticketId) => {
            socket.join(`ticket_${ticketId}`);
            console.log(`joined ticket_${ticketId}`);
        });
        socket.on("disconnect", () => {
            console.log("User Disconnected");
        });
    });
}
export default socketHandler;