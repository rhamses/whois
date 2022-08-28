<script setup>
import { ref } from 'vue'
import { SearchIcon, RefreshIcon } from '@heroicons/vue/solid'
import { useWebNotification } from "@vueuse/core";
// import mock from './assets/mock.json'
const seeRecords = ref(false)
const domain = ref('')
const error = ref(false)
const loading = ref(false)
let whois = ref('')

/**
 * VUE USE - Web NOTIFICATION - CONFIG
 */
const options = {
  title: 'Hello, world from VueUse!',
  dir: 'auto',
  lang: 'en',
  renotify: true,
  tag: 'test',
}
const {
  isSupported,
  show,
} = useWebNotification(options)
// function doNot() {
//   show({
//     title: "Custom Test",
//     dir: "auto",
//     lang: "pt-br",
//     renotify: true,
//     tag: 'update'
//   })
// }
/**
 * Main Function - Lookup Whois Call
 */
function getWhois() {
  loading.value = !loading.value
  whois.value = ''
  const domainValue = domain.value;
  const options = {
    method: "post",
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      domain: domainValue
    })
  }
  fetch(import.meta.env.VITE_API_HOSTING, options)
    .then(res => res.json())
    .then(res => {
      if (res['%error:101'] || res['%_note']) {
        error.value = true
      } else {
        error.value = false
      }
      setTimeout(() => {
        whois.value = res;
      }, 1000)
    })
    .finally(() => { 
      setTimeout(() => {
        loading.value = !loading.value
      }, 1000)
    })
}
</script>

<template>
  <main class="flex flex-col items-center h-screen justify-center max-w-xl ml-auto mr-auto">
    <h1 class="text-7xl font-bold">
      WHOIS
    </h1>
    <p class="text-xl">
      Search a domain. Create your list of favorites
    </p>
    <form @submit.prevent="getWhois" method="post" class="flex justify-center mt-5 group">
      <input class="rounded-lg 
        border border-gray-200 
        shadow 
        py-2 px-2 
        group-hover:py-3
        group-hover:px-3
        text-2xl 
        transition-all" type="text" placeholder="type a domain name" v-model="domain">
      <button type="submit" class="
        rounded-lg
        bg-sky-700
        hover:bg-sky-900
        active:bg-blue-900
        focus:bg-sky-900
        transition-all
        text-white
        px-3
        group-hover:px-4
        ml-2">
        <SearchIcon v-if="!loading" class="
          h-7 
          w-7
          group-hover:h-8
          group-hover:w-8
          transition-all
          text-white" />
        <div v-else class="flex">
          <RefreshIcon class="
          animate-spin
          h-7
          w-7
          group-hover:h-8
          group-hover:w-8
          transition-all
          text-white" />
          <span class="animate-pulse text-lg">
            Processing...
          </span>
        </div>
      </button>
    </form>
    <section v-if="whois && !error" id="cardResult" class="
      relative
      shadow 
      rounded-xl
      border border-gray-200 bg-slate-50
      my-10
      w-5/6">
      <header>
        <h2 class="text-center text-2xl p-5">Here are the main info from the records</h2>
      </header>
      <div id="highlight" class="
        shadow-xl
        flex justify-between
        rounded-xl
        -ml-6
        pb-2 pl-2 pr-2
        bg-gray-600">
        <p>
          <span class="text-sm text-gray-300">Created at: </span>
          <br />
          <b class="text-white text-xl">{{ whois.createdAt }}</b>
        </p>
        <p>
          <span class="text-sm text-gray-300">Last updated at: </span>
          <br />
          <b class="text-white text-xl">{{ whois.updatedAt }}</b>
        </p>
        <p>
          <span class="text-sm text-gray-300">Expires at: </span>
          <br />
          <b class="text-white text-xl">{{whois.expiresIn}}</b>
        </p>
        <p>
          <span class="text-sm text-gray-300">Status: </span>
          <br />
          <b class="text-white text-xl">{{whois.status}}</b>
        </p>
      </div>
      <div id="details">
        <a href="#code" @click="seeRecords = !seeRecords" class="text-center underline self-center block p-5">
          Click here to see all records
        </a>
        <article id="detailsRecords" class="flex flex-wrap transition-all max-h-0 overflow-hidden max-h"
          :class="{ 'max-h-96 overflow-y-scroll': seeRecords }">
          <template v-if="whois.raw" v-for="(item, index) in Object.keys(whois.raw)" :key="index">
            <p class="p-3 px-5 border-b w-full">
              <b>{{item}}:</b>
              <br />
              {{whois.raw[item]}}
            </p>
          </template>
        </article>
      </div>
    </section>
    <section v-if="error" class=" 
      capitalize
      w-5/6
      rounded-xl
      bg-red-100
      border border-red-500
      px-10 py-2
      my-10
      text-red-700">
      {{ whois['%error:101']}}
    </section>
  </main>
</template>
<style scoped>
  #highlight {
    width: calc(100% + 3em)
  }
  .hide-content {
    height: 0;
    overflow: hidden;
  }
  .show-content {
    height: 100vh;
    overflow: visible;
  }
</style>