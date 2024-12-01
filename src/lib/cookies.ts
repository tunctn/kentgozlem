export const COOKIE_PREFIX = "kentgozlem.com-";
export const COOKIES = {
	// Auth cookies
	AUTH_COOKIE: `${COOKIE_PREFIX}auth-cookie`,
	AUTH_REDIRECT: `${COOKIE_PREFIX}auth-redirect-url`,

	// OAuth cookies
	OAUTH_FLOW_START_URL: `${COOKIE_PREFIX}oauth-flow-start-url`,

	// Google OAuth cookies
	GOOGLE_OAUTH_STATE: `${COOKIE_PREFIX}google-oauth-state`,
	GOOGLE_OAUTH_CODE_VERIFIER: `${COOKIE_PREFIX}google-oauth-code-verifier`,

	// Mapbox cookies
	MAPBOX_3D_OBJECTS: `${COOKIE_PREFIX}mapbox_3d_objects`,
	MAPBOX_LIGHT_PRESET: `${COOKIE_PREFIX}mapbox_light_preset`,
	MAP_VIEW_STATE: `${COOKIE_PREFIX}map_view_state`,
	LAST_USER_COORDS: `${COOKIE_PREFIX}last_user_coords`,
	LIGHT_PRESET: `${COOKIE_PREFIX}light_preset`,

	// Theming cookies
	THEME: `${COOKIE_PREFIX}theme`,
} as const;
