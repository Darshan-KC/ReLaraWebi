export default function Chat() {
    const [message, setMessage] = useState('')
    return (
        <div>
            <h1>Chat App</h1>

            <div
                style={{
                    border: '1px solid #ccc',
                    height: '300px',
                    overflowY: 'scroll',
                    padding: '10px'
                }}
            >
                {messages.map((msg, index) => (
                    <div key={index}>{msg.body}</div>
                ))}
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                style={{ width: '70%', padding: '5px' }}
            />

            <button onClick={sendMessage} style={{ padding: '5px 10px' }}>
                Send
            </button>
        </div>
    );
}