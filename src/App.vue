<template>
  <!-- RouterView の場所に、URL に合ったページ（views/ の中のどれか）が表示される -->
  <RouterView />
</template>

<!-- scoped を付けないスタイルは、アプリ全体に効く -->
<style>
body {
  margin: 0;
  background: #000;
  color: #f2f2f2;
  font-family: 'Zen Kaku Gothic New', sans-serif;
}
button {
  padding: 14px 32px;
  font-family: inherit;
  font-size: 1.05rem;
  letter-spacing: 0.08em;
  color: #fff;
  background: rgba(10, 12, 25, 0.8);
  border: 1px solid rgba(255, 154, 60, 0.7);
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
button:hover {
  background: rgba(255, 123, 0, 0.25);
  box-shadow: 0 0 18px rgba(255, 123, 0, 0.5);
}
</style>
