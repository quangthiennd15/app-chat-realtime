import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import AppProvider from "./context/AppProvider";
import AddRoomModal from "./components/Modals/AddRoomModal";
import InviteMemberModal from "./components/Modals/InviteMemberModal";

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <NavBar />
      {!user ? (
        <Welcome />
      ) : (
        <>
          <AppProvider>
            <ChatBox />
            <AddRoomModal />
            <InviteMemberModal />
          </AppProvider>
        </>
      )}
    </div>
  );
}

export default App;