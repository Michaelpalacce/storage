<template>
	<div class="bg-gray-800 text-white">
		<div class="hidden sm:block max-w-7xl mx-auto text-white text-lg relative flex items-center justify-between sm:items-stretch sm:justify-start p-3 ">
			<div class="flex">
				<router-link class="hover:bg-gray-700 px-3 py-2 mx-2 rounded-md" to="/dashboard">Dashboard</router-link>
				<router-link class="hover:bg-gray-700 px-3 py-2 mx-2 rounded-md" to="/browse">Browse</router-link>
				<router-link class="hover:bg-gray-700 px-3 py-2 mx-2 rounded-md" to="/users">Users</router-link>
				<Button class="absolute right-5" @click="$router.push( { name: 'user' } )" text="Profile"/>
			</div>
		</div>

		<!-- Mobile menu, show/hide based on menu state. -->
		<div class="sm:hidden text-center">
			<button class="hamburger hamburger--elastic w-full text-right" type="button" @click="mobileCollapsed = ! mobileCollapsed">
				<span class="hamburger-box" >
					<span class="hamburger-inner" ></span>
				</span>
			</button>

			<div class="px-2 pt-2 pb-3 text-lg" :class="{ hidden: mobileCollapsed }">
				<router-link class="hover:bg-gray-700 block px-3 py-2 my-2 rounded-md" to="/dashboard">Dashboard</router-link>
				<router-link class="hover:bg-gray-700 block px-3 py-2 my-2 rounded-md" to="/browse">Browse</router-link>
				<router-link class="hover:bg-gray-700 block px-3 py-2 my-2 rounded-md" to="/users">Users</router-link>
				<Button @click="$router.push( { name: 'user' } )" text="Profile" class="text-center mx-auto"/>
			</div>
		</div>
	</div>
</template>

<script>
import communicator	from "@/app/main/api/communicator";
import Button		from "@/views/App/Components/Button";


export default {
	name: 'Navbar',
	components: { Button },
	data: () => {
		return {
			mobileCollapsed: true
		};
	},

	methods: {
		/**
		 * @brief	Logs the user out
		 *
		 * @details	After logout, redirect the user to /
		 * 			In case of error, still redirect the user to /
		 *
		 * @return	void
		 */
		async logout()
		{
			await communicator.logout().catch(()=>{});
			this.emitter.emit( 'user.credentials' );
			this.$router.push( '/' );
		}
	}
}
</script>

<style scoped>
@import './../../../style/hamburger.css';

.router-link-active{
	background-color: #111827;
}
.router-link-active:hover{
	background-color: #111827;
}

.hamburger.is-active .hamburger-inner,
.hamburger.is-active .hamburger-inner::before,
.hamburger.is-active .hamburger-inner::after {
	background-color: white;
}
.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after {
	background-color: white;
}
</style>