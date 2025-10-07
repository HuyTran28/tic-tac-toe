import styles from './Square.module.css'

export default function Square ({ value, handleClick }) {
    return (
        <button className={styles.square} onClick={handleClick}>{value}</button>
    )
};