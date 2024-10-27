import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { getAccounts } from './web3Utils';

const UsersPage = () => {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const accounts = await getAccounts();
      setUsers(accounts);
    };
    fetchUsers();
  }, []);

  return (
    <div className={styles.body}>
      <h1>Liste des Utilisateurs</h1>
      <div className={styles.userList}>
        {users.map((user, index) => (
          <Link to={`/user-collection/${user}`} key={index} className={styles.navLink}>
            <div className={styles.userItem}>
              <span className={styles.text}>Utilisateur {index + 1}: {user}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
