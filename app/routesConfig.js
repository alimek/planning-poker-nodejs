var routesConfig = {
    messageRoutes: {
        rabbitToSockio: [
            {queue: "game.join", channel: "gameJoin"}
        ],
        sockioToRabbit: [
            {channel: "gameStatus", queue: "game.join"}
        ]
    }
};

module.exports = routesConfig;
