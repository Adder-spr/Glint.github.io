<template>
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
  <div id="app">
    <vue-particles
        color="#409EFF"
        :particleOpacity="0.7"
        :particlesNumber="60"
        shapeType="circle"
        :particleSize="6"
        linesColor="#409EFF"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
        style="z-index:-1;"
    >
    </vue-particles>
    <router-view/>
  </div>
</template>

<script>


export default {
  name: 'App'
}
</script>

<style>
#app {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

#particles-js {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>

