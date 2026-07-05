import app from "./app";
import { env } from "./env";
import { logger } from "./utils/logger";

const PORT = env.PORT;

app.listen(PORT, () => {
	logger.info(
		`[server]: InSpectraServer is running at http://localhost:${PORT}`,
	);
});
