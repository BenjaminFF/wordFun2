<template>
    <div class="latest-learn">
      <create-set></create-set>
    </div>
</template>

<script>
    import CreateSet from "./create-set";
    export default {
        name: "latest-learn",
      components: {CreateSet}
    }
</script>

<style scoped>
  .latest-learn{
    width: 100%;
    height: 100%;
  }
</style>
