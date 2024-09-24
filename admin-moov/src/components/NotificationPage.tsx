import React, { useState } from "react";
import "./notification.css";

interface NotificationProps {
  avatar: string;
  name: string;
  action: string;
  target?: string;
  time: string;
  unread: boolean;
  message?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  avatar,
  name,
  action,
  target,
  time,
  unread,
  message,
}) => {
  return (
    <div className={`notifications ${unread ? "unreaded" : "readed"}`}>
      <div className="avatar">
        <img src={avatar} alt={`${name}'s avatar`} />
      </div>
      <div className="text">
        <div className="text-top">
          <p>
            <span className="profil-name">{name}</span> {action}{" "}
            {target && <b>{target}</b>}
            {unread && <span className="unread-dot"></span>}
          </p>
        </div>
        {message && <p>{message}</p>}
        <div className="text-bottom">{time}</div>
      </div>
    </div>
  );
};

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState([
    { avatar: "../logo.png", name: "Mark Webber", action: "reacted to your recent post", target: "My first tournament today!", time: "1m ago", unread: true },
    { avatar: "../logo.png", name: "Angela Gray", action: "followed you", time: "5m ago", unread: true },
    { avatar: "../logo.png", name: "Jacob Thompson", action: "has joined your group", target: "Chess Club", time: "1 day ago", unread: true },
    { avatar: "../logo.png", name: "Rizky Hasanuddin", action: "sent you a private message", time: "5 days ago", unread: false, message: "Hello, thanks for setting up the Chess Club. I've been a member for a few weeks now and I'm already having lots of fun and improving my game." },
    { avatar: "../logo.png", name: "Kimberly Smith", action: "commented on your picture", time: "1 week ago", unread: false },
    { avatar: "../logo.png", name: "Nathan Peterson", action: "reacted to your recent post", target: "5 end-game strategies to increase your win rate", time: "2 weeks ago", unread: true },
    { avatar: "../logo.png", name: "Anna Kim", action: "left the group", target: "Chess Club", time: "2 weeks ago", unread: false },
    { avatar: "../logo.png", name: "Mark Webber", action: "reacted to your recent post", target: "My first tournament today!", time: "1m ago", unread: true },
    { avatar: "../logo.png", name: "Angela Gray", action: "followed you", time: "5m ago", unread: true },
    { avatar: "../logo.png", name: "Jacob Thompson", action: "has joined your group", target: "Chess Club", time: "1 day ago", unread: true },
    { avatar: "../logo.png", name: "Rizky Hasanuddin", action: "sent you a private message", time: "5 days ago", unread: false, message: "Hello, thanks for setting up the Chess Club. I've been a member for a few weeks now and I'm already having lots of fun and improving my game." },
    { avatar: "../logo.png", name: "Kimberly Smith", action: "commented on your picture", time: "1 week ago", unread: false },
    { avatar: "../logo.png", name: "Nathan Peterson", action: "reacted to your recent post", target: "5 end-game strategies to increase your win rate", time: "2 weeks ago", unread: true },
    { avatar: "../logo.png", name: "Anna Kim", action: "left the group", target: "Chess Club", time: "2 weeks ago", unread: false },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Calcul des notifications à afficher selon la page actuelle
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="notifs">
      <div className="titregraph">
        <h3>Notification de panne </h3>
        <p>Ce tableau comporte la liste des clients avec son status, ils peuvent etre alors banni ou pas selon leur statut</p>
      </div>

      <div className="app">
        <div className="header">
          <h2>
            <span className="title">Notifications</span>{" "}
            <span className="unread-notification-number">{unreadCount}</span>
          </h2>
          <p onClick={markAllAsRead}>Marquer comme lu</p>
        </div>

        <div className="body">
          {currentNotifications.map((notification, index) => (
            <Notification key={index} {...notification} />
          ))}
        </div>

       
      </div>
       {/* Pagination */}
       <div className="pagination">
          <button
            className="precedent"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="bi bi-arrow-left-short"></i>
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="suivant"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="bi bi-arrow-right-short"></i>
          </button>
        </div>
    </div>
  );
};

export default NotificationPage;
