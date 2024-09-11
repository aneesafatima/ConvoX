import { useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import { GlobalState } from '../context/GlobalState';
import { showAlert } from '../utils/showAlert';

const useSocket = () => {
  const {
    currentUser,
    socket,
    setSocket,
    setFetchMessages,
    setFetchUserChats,
    setUnreadMessages,
    setSelectedChat,
    selectedChat,
  } = useContext(GlobalState);

  const selectedChatRef = useRef(selectedChat);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (currentUser && !socket) {
      setSocket(
        io(`${import.meta.env.VITE_URL}`, {
          query: {
            userId: currentUser._id,
          },
          withCredentials: true,
        })
      );
    }
  }, [currentUser]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Connected to the server with id : ', socket.id);

        socket.on('new-message', (sender) => {
          if (!selectedChatRef.current || selectedChatRef.current.info._id !== sender) {
            socket.emit('unread-message', {
              sender,
              receiver: currentUser._id,
            });
            setUnreadMessages((prev) => {
              const existingIndex = prev.findIndex((item) => item.from === sender);
              if (existingIndex !== -1) {
                const updatedUnreadMessages = [...prev];
                updatedUnreadMessages[existingIndex].count += 1;
                return updatedUnreadMessages;
              } else return [...prev, { from: sender, count: 1 }];
            });
          } else setFetchMessages(true);
        });

        socket.on('added-to-group', ({ userName, groupId, groupName }) => {
          showAlert(`${userName} added you to the group ${groupName}`, 'home');
          socket.emit('join-room', { roomId: groupId });
          setFetchUserChats(true);
        });

        socket.on('added-as-contact', (user) => {
          showAlert(`${user} added you as a contact`, 'home');
          setFetchUserChats(true);
        });

        socket.on('removed-from-group', (groupName) => {
          showAlert(`You have been removed from the group ${groupName}`, 'home');
        });

        socket.on('group-name-updated', () => {
          setFetchUserChats(true);
        });

        socket.on('group-deleted', (groupId) => {
          setFetchUserChats(true);
          if (selectedChatRef.current?.info._id === groupId) {
            setFetchMessages(true);
            setSelectedChat(null);
          }
        });

        socket.on('added-new-grp-member', (groupId) => {
          if (selectedChatRef.current?.info._id === groupId)
            setSelectedChat((prev) => ({ ...prev }));
        });
      });

      return () => {
        console.log('User disconnected: ', socket.id);
        socket.disconnect();
      };
    }
  }, [socket]);
};

export default useSocket;