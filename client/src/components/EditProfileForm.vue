<script setup lang="ts">
import { useStudentStore } from '@/stores/student.store'
import { updateStudent } from '@/api/student'
import { reactive, ref } from 'vue'
import { errorToast, successToast } from '@/library/toast'
import { courses, yearLevels } from '@/library/course'
import Input from './ui/TextField.vue'
import { toBase64 } from '@/library/base64'
const { student, setStudent } = useStudentStore()

const profileInfo = reactive({
  idno: student.idno,
  firstname: student.firstname,
  middlename: student.middlename,
  lastname: student.lastname,
  course: student.course,
  yearlevel: student.yearlevel,
  email: student.email,
  username: student.username,
  password: student.password,
  poke_icon: student.poke_icon
})

const studentPassword = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
})

const editCourseYear = ref(false)
const editStudentName = ref(false)
const editEmailUsername = ref(false)
const editPassword = ref(false)

const toggleEditCourseYear = () => {
  editCourseYear.value = !editCourseYear.value
}

const toggleEditStudentName = () => {
  editStudentName.value = !editStudentName.value
}

const toggleEditEmailUsername = () => {
    editEmailUsername.value = !editEmailUsername.value;
}

const toggleEditPassword = () => {
    editPassword.value = !editPassword.value;
}

const updateProfile = async () => {
  const response = await updateStudent(profileInfo)

  if (response.success) {
    successToast('Profile updated successfully')
    setStudent(profileInfo)
  } else {
    errorToast('Failed to update profile')
  }
}

const handleChangeCourseYear = () => {
  if(!profileInfo.course || !profileInfo.yearlevel) {
    errorToast('Please fill out all the fields')
    return
  }
    updateProfile()
    toggleEditCourseYear()
}

const handleChangeStudentName = () => {
    if(!profileInfo.firstname || !profileInfo.middlename || !profileInfo.lastname) {
        errorToast('Please fill out all the fields')
        return
    }
    updateProfile()
    toggleEditStudentName()
}

const handleChangeEmailUsername = () => {
    if(!profileInfo.email || !profileInfo.username) {
        errorToast('Please fill out all the fields')
        return
    }
    if (profileInfo.email !== student.email || profileInfo.username !== student.username) {
        updateProfile()
        toggleEditEmailUsername()
    }
}

const handleChangePassword = () => {
    if(studentPassword.currentPassword !== student.password) {
        errorToast('Current password is incorrect')
    }
    if (studentPassword.newPassword !== studentPassword.confirmPassword) {
        errorToast('Passwords do not match')   
    }
    
    if (studentPassword.currentPassword === student.password && studentPassword.newPassword === studentPassword.confirmPassword) {
        profileInfo.password = studentPassword.newPassword
        updateProfile()
        toggleEditPassword()
    }

}


</script>

<template>

  <div class="h-screen max-w-screen pt-20 flex flex-col ">
    <div class="w-[calc(90%)] h-[200px]">
      <div
        class="w-full h-full bg-[url('../assets/cover.png')] bg-center rounded-lg shadow-md shadow-[#181818]"
      ></div>
      <div class="relative -top-25 left-10">
        <div
          :style="{'background-image': toBase64(student.poke_icon)}"
          class="absolute size-50 rounded-full bg-contain bg-no-repeat bg-bottom border-4 border-[#181818] bg-[#202020] z-10"
        />
      </div>
    </div>
    <div class="w-[57.5%] my-2 flex flex-col">
      <h1 class="text-[#b2b2b2] text-3xl font-bold">
        <div class="flex items-end">
          {{ student.firstname }} {{ student.middlename }} {{ student.lastname }} 
          <p class="text-[#8e8e8e] text-[16px] pb-1">&nbsp;&nbsp;({{ student.idno }})</p>
        </div>
      </h1>
      <h1 class="text-xl font-semibold text-[#00BD7E]">{{ student.username }}</h1>
    </div>

    <div class="w-[calc(90%)] h-[calc(100%-350px)] flex justify-between mt-10">
      <div class="w-[calc(45%)] flex flex-col justify-between">
        <div class="w-full h-[45%] px-5 pt-5 flex flex-col justify-start rounded-xl bg-[#202020]">
          <div class="w-full flex justify-start">
            <h1 class="text-[#e8e8e8] text-xl font-bold">Student Name</h1>
          </div>
          <div class="flex gap-10 py-2">
            <Input
              placeholder="First Name"
              v-model="profileInfo.firstname"
              type="text"
              :editable="editStudentName"
              class="w-[20%] my-3"
              />
              <Input
              placeholder="Middle Name"
              :editable="editStudentName"
              v-model="profileInfo.middlename"
              type="text"
              class="w-[25%] my-3" 
              />
              <Input
              placeholder="Last Name"
              :editable="editStudentName"
              v-model="profileInfo.lastname"
              type="text"
              class="w-[20%] my-3"
            />
            <div class="w-[20%] flex justify-end pt-5">
              <button
                v-if="!editStudentName"
                @click="toggleEditStudentName"
                class="w-full py-2 rounded hover:text-[#ffff] font-semibold cursor-pointer text-md border-1 text-[#00BD7E] border-[#00BD7E] hover:bg-[#00BD7E] transition-colors duration-400"
              >
                EDIT
              </button>
              <button
                v-else
                @click="handleChangeStudentName"
                class="w-full py-2 rounded text-[#ffff] font-semibold cursor-pointer text-md border-1 hover:border-[#00BD7E]/65 border-[#00BD7E] bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
        <div class="w-full h-[45%] px-5 pt-5 flex flex-col justify-start rounded-xl bg-[#202020]">
          <div class="w-full flex justify-start">
            <h1 class="text-[#e8e8e8] text-xl font-bold">Email & Username</h1>
          </div>
          <div class="flex gap-15 py-2">
            <Input
              placeholder="First Name"
              v-model="profileInfo.email"
              :editable="editEmailUsername"
              type="text"
              class="w-[45%] my-3"
              />
              
              <Input
              :editable="editEmailUsername"
              placeholder="Last Name"
              v-model="profileInfo.username"
              type="text"
              class="w-[20%] my-3"
            />
            <div class="w-[20%] flex justify-end pt-5">
              <button
                v-if="!editEmailUsername"
                @click="toggleEditEmailUsername"
                class="w-full py-2 rounded hover:text-[#ffff] font-semibold cursor-pointer text-md border-1 text-[#00BD7E] border-[#00BD7E] hover:bg-[#00BD7E] transition-colors duration-400"
              >
                EDIT
              </button>
              <button
                v-else
                @click="handleChangeEmailUsername"
                class="w-full py-2 rounded text-[#ffff] font-semibold cursor-pointer text-md border-1 hover:border-[#00BD7E]/65 border-[#00BD7E] bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="w-[calc(25%)] flex flex-col justify-start items-center bg-[#202020] rounded-xl gap-8"
      >
        <div class="w-full px-5 pt-5 flex justify-start">
          <h1 class="text-[#e8e8e8] text-xl font-bold">Course and Year Level</h1>
        </div>
        <div class="w-[70%] h-10 relative mt-[1px]" :class="{ 'pointer-events-none': !editCourseYear }">
          <select
            v-model="profileInfo.course"
            name="course"
            class="h-full my-[calc(var(--spacing)*2.28)] px-2 w-full outline-none placeholder:text-[#8e8e8e]"
          >
            <option
              v-for="course in courses"
              :key="course"
              :value="course"
              class="text-[#f8f8f8] bg-[#181818] outline-none"
            >
              {{ course }}
            </option>
          </select>
          <div
            class="absolute top-0 w-full h-full pb-7.75 pt-4.75 border-b-2 border-[#3e3e3e] px-2 text-[#8e8e8e] pointer-events-none"
          >
            {{ profileInfo.course ? '' : 'Course' }}
          </div>
        </div>

        <div class="w-[70%] h-10 relative mt-[1px]" :class="{ 'pointer-events-none': !editCourseYear }">
          <select
            v-model="profileInfo.yearlevel"
            name="year level"
            class="h-full my-[calc(var(--spacing)*2.28)] px-2 w-full outline-none placeholder:text-[#8e8e8e]"
          >
            <option
              v-for="yearLevel in yearLevels"
              :key="yearLevel"
              :value="yearLevel"
              class="text-[#f8f8f8] bg-[#181818] outline-none"
            >
              {{ yearLevel }}
            </option>
          </select>
          <div
            class="absolute top-0 w-full h-full pb-7.75 pt-4.75 border-b-2 border-[#3e3e3e] px-2 text-[#8e8e8e] pointer-events-none"
          >
            {{ profileInfo.yearlevel ? '' : 'Year Level' }}
          </div>
        </div>
        <div class="w-[70%] flex justify-end pt-5">
          <button
            v-if="!editCourseYear"
            @click="toggleEditCourseYear"
            class="w-3/7 py-2 rounded hover:text-[#ffff] font-semibold cursor-pointer text-md border-1 text-[#00BD7E] border-[#00BD7E] hover:bg-[#00BD7E] transition-colors duration-400"
          >
            EDIT
          </button>
          <button
            v-else
            @click="handleChangeCourseYear"
            class="w-3/7 py-2 rounded text-[#ffff] font-semibold cursor-pointer text-md border-1 hover:border-[#00BD7E]/65 border-[#00BD7E] bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400"
          >
            CONFIRM
          </button>
        </div>
      </div>
      <div class="w-[calc(25%)] flex flex-col justify-start items-center bg-[#202020] rounded-xl">
        <div class="w-full px-5 pt-5 flex justify-start">
          <h1 class="text-[#e8e8e8] text-xl font-bold">Password</h1>
        </div>
        <div class="w-[70%] flex flex-col  mt-[1px]">

        <Input
          placeholder="Current Password"
          :editable="editPassword"
          v-model="studentPassword.currentPassword"
          type="password"
          class="w-full my-2.25"
          />
          <Input
          placeholder="New Password"
          :editable="editPassword"
          v-model="studentPassword.newPassword"
          type="password"
          class="w-full my-2.25"
          />
          <Input
          placeholder="Confirm Password"
          :editable="editPassword"
          v-model="studentPassword.confirmPassword"
          type="password"
          class="w-full my-2.25"
        />
        </div>  
        <div class="w-[70%] flex justify-end pt-5.75">
          <button
            v-if="!editPassword"
            @click="toggleEditPassword"
            class="w-3/7 py-2 rounded hover:text-[#ffff] font-semibold cursor-pointer text-md border-1 text-[#00BD7E] border-[#00BD7E] hover:bg-[#00BD7E] transition-colors duration-400"
          >
            EDIT
          </button>
          <button
            v-else
            @click="handleChangePassword"
            class="w-3/7 py-2 rounded text-[#ffff] font-semibold cursor-pointer text-md border-1 hover:border-[#00BD7E]/65 border-[#00BD7E] bg-[#00BD7E] hover:bg-[#00BD7E]/65 transition-colors duration-400"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
