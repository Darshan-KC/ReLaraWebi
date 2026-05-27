namespace App\DTO\Friendship;

class SendFriendRequestDTO
{
    public function __construct(
        public readonly int $senderId,
        public readonly int $receiverId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            senderId: auth()->id(),
            receiverId: $data['receiver_id'],
        );
    }
}