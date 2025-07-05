<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { User} from '../types/user'
import { getUsers } from '../services/user.service'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const showErrorDialog = ref(false)
const errorMessage = ref('')

function togglePassword() {
  showPassword.value = !showPassword.value
}

const users = ref<User[]>([]);
async function fetchUsers() {
  users.value = await getUsers();
}

onMounted(fetchUsers);

function login() {
  const foundUser = users.value.find((u: User) => u.username === email.value)
  
  console.log(email.value)
  if (!foundUser) {
    errorMessage.value = 'ไม่มีผู้ใช้นี้ในระบบ'
    showErrorDialog.value = true
    return
  }

  if (foundUser.password !== password.value) {
    errorMessage.value = 'รหัสผ่านไม่ถูกต้อง'
    showErrorDialog.value = true
    return
  }

  localStorage.setItem('user', JSON.stringify(foundUser))

  if (foundUser.role === 'admin') {
    router.push('/dashboard')
  } else {
    router.push('/home')
  }
}

</script>

<template>
  <div class="lg:flex h-screen">

    <div class="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center">
      <div class="flex flex-col items-start px-16 py-20 space-y-8 max-w-xl">

        <div class="flex items-center text-2xl text-white font-bold mb-20">
          <div class="bg-white text-primary w-12 h-12 flex items-center justify-center rounded-lg text-2xl font-bold">
            H
          </div>
          <span class="ml-3 mt-1 text-2xl tracking-wide">EALTH CARE</span>
        </div>

        <div class="space-y-2">
          <h1 class="text-white font-extrabold text-[80px] leading-tight">Hello,</h1>
          <h1 class="text-white font-extrabold text-[80px] leading-tight">welcome!</h1>
        </div>

        <div>
          <p class="text-white text-lg leading-relaxed">
            Lorem ipsum is placeholder text commonly used in the graphic, print, and
            publishing industries for previewing layouts and visual mockups.
          </p>
        </div>

      </div>
    </div>

    <div class="flex items-center justify-center w-full lg:w-1/2 p-8 min-h-screen lg:min-h-full">
      <div class="w-full max-w-md">

        <div class="md:hidden mb-20 flex text-2xl text-primary font-bold">
          <div class="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">
            H
          </div>
          <span class="mt-1 ml-2">EALTH CARE</span>
        </div>

        <h2 class="font-bold text-center mb-6 mt-6 text-primary" style="font-size: 57px;">LOGIN</h2>
        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label class="block mb-1 text-sm text-gray-600">Username</label>
            <input v-model="email" type="text" required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-primary focus:border-primary" />
          </div>

          <div>
            <label class="block mb-1 text-sm text-gray-600">Password</label>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="password" required
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-primary focus:border-primary pr-10" />
              <button type="button" @click="togglePassword"
                class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 focus:outline-none">
                <i :class="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="w-full py-2 bg-primary text-white font-semibold rounded">
            LOGIN
          </button>
        </form>
      </div>
    </div>

    <div v-if="showErrorDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
        <i class="mdi mdi-alert-circle text-[55px] text-red-600"></i>
        <p class="text-gray-700 mb-6">{{ errorMessage }}</p>
        <button @click="showErrorDialog = false"
          class="px-4 py-2 bg-gray-200 hover:text-white rounded hover:bg-primary">
          DONE
        </button>
      </div>
    </div>
  </div>
</template>
