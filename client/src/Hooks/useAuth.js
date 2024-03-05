/**
 *
 * context and providers are used for global state management
 * (eg. access a variable from here to any component in the hierarchy)
 *
 */

import { createContext, useEffect, useState } from 'react';

// google console user_account client id
const CLIENT_ID = '987122640202-cttf76h8r41jmu6fp13ihoun32nuigq1.apps.googleusercontent.com';

// context allows for the state to be accessed anywhere in the application
const AccountContext = createContext();

/**
 * This is a custom Google Login Button that's hidden from the user.
 * It's used to trigger the Google Login Popup.
 *
 */
function HiddenGoogleButton() {
	const googleLoginWrapper = document.createElement('div');
	// Or you can simple hide it in CSS rule for custom-google-button
	googleLoginWrapper.style.display = 'none';
	googleLoginWrapper.classList.add('custom-google-button');

	// Add the wrapper to body
	document.body.appendChild(googleLoginWrapper);

	// Use GSI javascript api to render the button inside our wrapper
	// You can ignore the properties because this button will not appear
	window.google.accounts.id.renderButton(googleLoginWrapper, {});

	const googleLoginWrapperButton = googleLoginWrapper.querySelector('div[role=button]');

	return {
		click: () => {
			googleLoginWrapperButton.click();

			// Get all elements with class="custom-google-button"
			var elementsToRemove = document.querySelectorAll('.custom-google-button');

			// Iterate through the NodeList and remove each element
			for (var i = 0; i < elementsToRemove.length; i++) {
				elementsToRemove[i].remove();
			}
		},
	};
}

// provider is a wrapper for the entire application
function AccountProvider({ children }) {
	const [isLoggedIn, setIsLoggedIn] = useState(null);
	const [route, setRoute] = useState(null);
	const token = localStorage.getItem('token');

	// Callback handler when google sign in is successful
	useEffect(() => {
		// load and initialize the user_account from the Google Cloud Console
		window.google.accounts.id.initialize({
			/**
			 * auto select user account
			 * (used by the one-tap sign-up prompt when the existing token has expired or invalid)
			 *
			 */

			auto_select: true,
			client_id: CLIENT_ID,

			// login handler callback
			callback: res => {
				setIsLoggedIn(true);

				// set the token in local storage
				localStorage.setItem('token', res.credential);
				console.log('Google Login Success', res.credential);
			},
		});

		if (!token) {
			setIsLoggedIn(false);
			return;
		}

		fetch('http://localhost:5000/api/account/authenticate', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(res => {
				if (!res.ok) {
					throw new Error(`HTTP error! Authentication Status: ${res.status}`);
				}
				return res.json();
			})
			.then(data => {
				sessionStorage.setItem('auth', data);
				setIsLoggedIn(true);
			})
			.catch(error => {
				console.log(error);
				/**
				 * shows the one-tap sign-in prompt
				 * auto selects the account since auto_select is set to true in Account Provider
				 *
				 */
				setIsLoggedIn(false);
				window.google.accounts.id.prompt();
			});
	}, []);

	const Account = {
		// handled by the account provider
		isLoggedIn: isLoggedIn,

		// handled by the router component
		route: route,
		setRoute: setRoute,

		// context functions
		login: () => HiddenGoogleButton().click(),
		logout: () => {
			window.google.accounts.id.disableAutoSelect();
			localStorage.clear();
			setIsLoggedIn(false);
		},
	};

	return <AccountContext.Provider value={{ Account }}>{children}</AccountContext.Provider>;
}

export { AccountProvider, AccountContext };