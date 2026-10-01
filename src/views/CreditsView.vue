<template>
  <!-- 素材を作ってくれた人の表記。フリー素材を使うときは、規約に合わせて書いておこう -->
  <div class="credits">
    <h1>CREDITS</h1>

    <h2>Characters</h2>
    <p>
      ずんだもん・四国めたん：東北ずん子・ずんだもんプロジェクト（ガイドライン準拠）<br />
      <a href="https://zunko.jp/guideline.html" target="_blank">zunko.jp</a>
    </p>

    <h2>Character Sprites</h2>
    <p>
      坂本アヒル「ずんだもん立ち絵素材V3.2」「四国めたん立ち絵素材2.1」<br />
      <a href="https://ext.seiga.nicovideo.jp/seiga/im11206626" target="_blank">ニコニコ静画</a>
    </p>

    <h2>Backgrounds</h2>
    <p>
      Potat0Master「Free Visual Novel Backgrounds (School Mini Pack 1)」<br />
      <a href="https://potat0master.itch.io/free-visual-novel-backgrounds-school-mini-pack-1" target="_blank">potat0master.itch.io</a>
    </p>

    <h2>Event Stills</h2>
    <p>上記の立ち絵と背景を合成・加工して作成</p>

    <h2>Music &amp; Sound</h2>
    <p>BGM・効果音とも Web Audio API でその場で作曲・生成</p>

    <h2>Fonts</h2>
    <p>Zen Kaku Gothic New / Share Tech Mono（Google Fonts）</p>

    <RouterLink to="/">TITLE</RouterLink>
  </div>
</template>

<style scoped>
.credits {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  box-sizing: border-box;
  text-align: center;
  background: #080a14;
}
h1 {
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.4em;
  color: #ff9a3c;
}
h2 {
  margin: 24px 0 4px;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  color: #888;
}
p {
  margin: 0;
  line-height: 1.8;
}
a {
  color: #ffd166;
}
</style>
