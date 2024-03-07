import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // console.log(file, "heree");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    const filename = `${file.fieldname}-${uniqueSuffix}.${fileExtension}`;
    cb(null, filename);
  },
});

export const upload = multer({ storage: storage });
