import { useState } from "react";
import "./index.css";
const initialFriends = [
  {
    id: 1,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 2,
    name: "Simon",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 3,
    name: "Jack",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setIsOpen(false);
  }
  function handleOpen() {
    setIsOpen((Show) => !Show);
  }
  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));

    setIsOpen(false);
  }

  function handleSplittingBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          OnSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {isOpen && <AddFriend OnAddFriend={handleAddFriend} />}
        <Button onClick={handleOpen}>{isOpen ? "Close" : "Add Friend"}</Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplittingBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, OnSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <div>
          <Friend
            friend={friend}
            key={friend.id}
            OnSelection={OnSelection}
            selectedFriend={selectedFriend}
          />
        </div>
      ))}
    </ul>
  );
}
function Friend({ friend, OnSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <div>
        <h4>{friend.name}</h4>
        <h5>
          {friend.balance < 0 && (
            <div className="red">
              You owe {friend.name} {Math.abs(friend.balance)}$
            </div>
          )}
          {friend.balance > 0 && (
            <div className="green">
              {friend.name} ows you {friend.balance}$
            </div>
          )}
          {friend.balance === 0 && (
            <div className="gray">You and {friend.name} are even</div>
          )}
        </h5>
      </div>

      <Button onClick={() => OnSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriend({ OnAddFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  const id = crypto.randomUUID;
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !img) {
      return;
    }
    const newFriend = {
      name,
      image: `${img}?=${id}`,
      balance: 0,
    };
    OnAddFriend(newFriend);
    setName("");
    setImg("https://i.pravatar.cc/48");
  }
  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image URL</label>
      <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />
      <Button>Add</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [padiByUser, setpaidByUser] = useState("");
  const [whoPays, setWhopays] = useState("user");

  const paidFriend = bill ? bill - padiByUser : "";

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !padiByUser) return;
    onSplitBill(whoPays === "user" ? paidFriend : -padiByUser);
  }
  return (
    <form className="form-split" onSubmit={handleSubmit}>
      <h2>Split the bill with {selectedFriend.name}</h2>
      <label>Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your expence:</label>
      <input
        type="text"
        value={padiByUser}
        onChange={(e) =>
          setpaidByUser(
            Number(e.target.value) > bill ? padiByUser : Number(e.target.value)
          )
        }
      />
      <label>{selectedFriend.name}'s expence:</label>
      <input disabled type="text" value={paidFriend} />

      <label>Who is paying bill</label>
      <select value={whoPays} onChange={(e) => setWhopays(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
