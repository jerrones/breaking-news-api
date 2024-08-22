import {
    createService,
    findAllService,
    countService,
    topNewsService,
    findByIdService,
    searchByTitleService,
    byUserService,
} from "../services/news.service.js";

export const create = async (req, res) => {
    try {
        const { title, content, banner } = req.body;

        if (!title || !banner || !content) {
            res.status(400).send({
                message: "Submit all fields for registration",
            });
        }

        await createService({
            user: req.userId,
            title,
            content,
            banner,
        });

        res.send(201);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const findAll = async (req, res) => {
    try {
        let { offset, limit } = req.query;

        offset = Number(offset);
        limit = Number(limit);

        if (!offset) {
            offset = 0;
        }

        if (!limit) {
            limit = 5;
        }

        const news = await findAllService(offset, limit);
        const total = await countService();
        const currentUrl = req.baseUrl;

        const next = offset + limit;

        const nextUrl =
            next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl =
            previous != null
                ? `${currentUrl}?limit=${limit}&offset=${previous}`
                : null;

        if (news.lenght === 0) {
            return res
                .status(400)
                .send({ message: "There are no registered news" });
        }

        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                content: item.content,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                userName: item.user.username,
                userAvatar: item.user.avatar,
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const topNews = async (req, res) => {
    try {
        const news = await topNewsService();

        if (!news) {
            return res
                .status(400)
                .send({ message: "There is no registered post" });
        }

        res.send({
            news: {
                id: news._id,
                title: news.title,
                content: news.content,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                userName: news.user.username,
                userAvatar: news.user.avatar,
            },
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const findById = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await findByIdService(id);

        res.send({
            news: {
                id: news._id,
                title: news.title,
                content: news.content,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                userName: news.user.username,
                userAvatar: news.user.avatar,
            },
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        const news = await searchByTitleService(title);

        if (news.lenght === 0) {
            return res
                .status(400)
                .send({ message: "There are no posts with this title" });
        }

        res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                content: item.content,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                userName: item.user.username,
                userAvatar: item.user.avatar,
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const byUser = async (req, res) => {
    try {
        const id = req.userId;

        const news = await byUserService(id);

        res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                content: item.content,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                userName: item.user.username,
                userAvatar: item.user.avatar,
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
