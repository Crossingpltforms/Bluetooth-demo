module.exports  = api => {
	const babelEnv = api.env();
	const plugins = [["@babel/plugin-proposal-decorators", { "legacy": true }]];
	//change to 'production' to check if this is working in 'development' mode
	if (babelEnv !== 'development') {
		plugins.push(['transform-remove-console', {exclude: ['error', 'warn']}]);
	}
	return {
		presets: ['module:metro-react-native-babel-preset'],
		plugins,
	};

};
