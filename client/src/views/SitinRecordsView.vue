<script setup lang="ts">
import AdminNavbar from '@/components/AdminNavbar.vue'
import { onBeforeMount, ref } from 'vue'
import { getSitins } from '@/api/sitin'
import { setDate } from '@/library/date'
import type { Sitin } from '@/types/Sitin'
import { tableHeaders } from '@/library/table'

const sitins = ref<Sitin[]>([])
onBeforeMount(async () => {
  const response = await getSitins()
  sitins.value = response.sitins
  console.log(sitins.value)
})
</script>

<template>
  <AdminNavbar />
  <div class="flex flex-row items-start justify-center h-screen w-screen pt-40">
    <div class="flex flex-col w-[85%]">
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th v-for="(header, index) in tableHeaders" :key="index" scope="col"
                    class="px-6 py-3 text-middle text-xl font-bold text-[#f8f8f8] uppercase">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr :class="index % 2 === 0 ? 'bg-[#202020]' : ''" class="text-lg text-[#f8f8f8]" v-for="(sitin, index) in sitins" :key="sitin.sitin_id">
                  <td v-for="field in ['idno', 'fullname', 'course', 'yearlevel', 'sitin_purpose', 'sitin_laboratory', 'sitin_timein', 'sitin_timeout']" :key="field"
                    class="px-6 py-6 whitespace-nowrap font-semibold text-md text-[#8e8e8e]" 
                    :class="field === 'sitin_laboratory' ? 'w-20 text-center' : field === 'course' || field === 'yearlevel' ? 'text-center' : ''">
                    {{ field === 'sitin_timein' || field === 'sitin_timeout' ? setDate(sitin[field as keyof Sitin]) : sitin[field as keyof Sitin] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
