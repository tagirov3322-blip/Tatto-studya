"use client";

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: "#0a0a0a", color: "#e0e0e0", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif", lineHeight: 1.8 }}>
        <a href="/" style={{ color: "#888", textDecoration: "none", fontSize: "14px" }}>← На главную</a>

        <h1 style={{ fontSize: "32px", marginTop: "20px", marginBottom: "10px", color: "#fff" }}>
          Политика конфиденциальности
        </h1>
        <p style={{ color: "#888", marginBottom: "30px" }}>Последнее обновление: 30.03.2026</p>

        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "10px" }}>1. Общие положения</h2>
          <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта тату-студии «КЛЯКСА» (далее — Студия).</p>
          <p>Используя сайт и оставляя свои данные, вы соглашаетесь с условиями данной Политики.</p>
        </section>

        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "10px" }}>2. Какие данные мы собираем</h2>
          <p>При записи на сеанс мы запрашиваем:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
            <li>Имя</li>
            <li>Номер телефона</li>
            <li>Адрес электронной почты (необязательно)</li>
            <li>Описание желаемой татуировки</li>
            <li>Желаемая дата и время сеанса</li>
          </ul>
        </section>

        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "10px" }}>3. Цели обработки данных</h2>
          <p>Персональные данные используются исключительно для:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
            <li>Обработки заявок на запись к мастеру</li>
            <li>Связи с клиентом для подтверждения или изменения записи</li>
            <li>Улучшения качества обслуживания</li>
          </ul>
        </section>

        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "10px" }}>4. Защита данных</h2>
          <p>Мы принимаем необходимые меры для защиты ваших персональных данных:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
            <li>Данные хранятся на защищённых серверах с шифрованием</li>
            <li>Доступ к данным клиентов имеют только авторизованные сотрудники</li>
            <li>Используется безопасное HTTPS-соединение</li>
            <li>Применяется защита от несанкционированного доступа</li>
          </ul>
        </section>

        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "10px" }}>5. Передача данных третьим лицам</h2>
          <p>Мы не продаём, не обмениваем и не передаём ваши персональные данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством Российской Федерации.</p>
        </section>

        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "10px" }}>6. Хранение данных</h2>
          <p>Персональные данные хранятся в течение срока, необходимого для достижения целей обработки. После завершения оказания услуг данные могут быть удалены по вашему запросу.</p>
        </section>

        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "10px" }}>7. Права пользователя</h2>
          <p>Вы имеете право:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
            <li>Запросить информацию о хранящихся данных</li>
            <li>Потребовать исправления неточных данных</li>
            <li>Потребовать удаления ваших персональных данных</li>
            <li>Отозвать согласие на обработку данных</li>
          </ul>
        </section>

        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "10px" }}>8. Файлы cookie</h2>
          <p>Сайт может использовать файлы cookie для обеспечения корректной работы и улучшения пользовательского опыта. Вы можете отключить cookie в настройках браузера.</p>
        </section>

        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "10px" }}>9. Контакты</h2>
          <p>По вопросам, связанным с обработкой персональных данных, обращайтесь:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
            <li>Email: info@klaksa-tattoo.ru</li>
            <li>Телефон: +7 (XXX) XXX-XX-XX</li>
          </ul>
        </section>

        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "10px" }}>10. Изменения политики</h2>
          <p>Студия оставляет за собой право вносить изменения в настоящую Политику. Актуальная версия всегда доступна на данной странице.</p>
        </section>

        <hr style={{ borderColor: "#333", margin: "30px 0" }} />
        <p style={{ color: "#666", fontSize: "14px" }}>© 2026 Тату-студия «КЛЯКСА». Все права защищены.</p>
      </div>
    </div>
  );
}
