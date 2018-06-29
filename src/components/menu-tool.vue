<template>
    <div class="menu-tool">
      <float-button iconname="tool" size="middle" class="menu-icon"></float-button>
      <float-button iconname="delete" size="small" class="delete-icon"></float-button>
      <float-button iconname="tick" size="small" class="search-icon"></float-button>
      <float-button iconname="add" size="small" class="add-icon"></float-button>
    </div>
</template>

<script>
    import FloatButton from "./float-button";
    export default {
        name: "menu-tool",
      data(){

      },
      components: {FloatButton}
    }
</script>

<style scoped>
  .menu-tool{
    width: 3rem;
    height: 3rem;
    position: absolute;
    right: 15rem;
    bottom: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .menu-icon{
    position: absolute;
    cursor: pointer;
  }
  .delete-icon{
    position: absolute;
    transform: translateX(-3rem);
  }
  .search-icon{
    position: absolute;
    transform: translateX(3rem);
  }

  .add-icon{
    position: absolute;
    transform: translateY(-3rem);
  }
</style>
