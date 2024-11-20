import { BiLock, BiSave, BiUpload } from "react-icons/bi";
import { AiOutlineFilePdf, AiOutlineVideoCamera } from "react-icons/ai";
import { FaFileExcel } from "react-icons/fa";
import Styles from "./Attachements.module.css";
import { MdImage } from "react-icons/md";

const Attachements = ({
  title = true,
  files,
  setFile,
  setDesc,
  orderConfirmed,
  setConfirm,
  children,
  unLockIcon = false,
}) => {
  function handleChange(e) {
    let tempFile = [...files];
    let reqfiles = e.target.files;
    if (reqfiles) {
      if (reqfiles.length > 0) {
        Object.keys(reqfiles).map((index) => {
          let url = URL.createObjectURL(reqfiles[index]);
          if (url) {
            tempFile.push({ preview: url, file: reqfiles[index] });
          }
        });
      }
    }
    setFile(tempFile);
  }

  const shakeHandler = () => {
    let lock1 = document.getElementById("lock2");
    if (lock1) {
      setTimeout(() => {
        lock1.classList.remove(Styles.shake);
      }, 300);
      lock1.classList.add(Styles.shake);
    }
  };

  const ImageSlider = () => {
    return files.map((file, index) => {
      const fileType = file.file.type;
      const fileName = file.file.name.toLowerCase();
      const isImage =
        fileType.startsWith("image/") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".png") ||
        fileName.endsWith(".gif");
      const isJFIF = fileName.endsWith(".jfif");
      const isPDF = fileType === "application/pdf";
      const isVideo = fileType.startsWith("video/");
      const isExcel = fileName.endsWith(".xls") || fileName.endsWith(".xlsx");
      return (
        <div key={index} style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              right: "5px",
              top: "-5px",
              color: "#000",
              zIndex: 1,
              cursor: "pointer",
              fontSize: "18px",
            }}
            onClick={() => fileRemoveHandler(index)}
          >
            x
          </span>
          <a
            href={file.preview}
            target="_blank"
            title="Click to Download"
            rel="noreferrer"
          >
            {isImage || isJFIF ? (
              <div className={Styles.fileIcon}>
                <img
                  src={file.preview}
                  alt={file.file.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                  className={Styles.imagePreview}
                />
              </div>
            ) : isPDF ? (
              <div className={Styles.fileIcon}>
                <AiOutlineFilePdf size={48} color="#000000" />
              </div>
            ) : isVideo ? (
              <div className={Styles.fileIcon}>
                <AiOutlineVideoCamera size={48} color="#000000" />
              </div>
            ) : isExcel ? (
              <div className={Styles.fileIcon}>
                <FaFileExcel size={48} color="#000000" />
              </div>
            ) : (
              <div className={Styles.fileIcon}>
                <MdImage size={48} color="#000000" />{" "}
                {/* Default image icon for unknown files */}
              </div>
            )}
          </a>
        </div>
      );
    });
  };

  const fileRemoveHandler = (index) => {
    let tempFile = [...files];
    tempFile.splice(index, 1);
    setFile(tempFile);
  };

  return (
    <section style={{ borderBottom: "1px solid #ccc" }} id="AttachementSection">
      <h2
        className={`${Styles.reasonTitle} ${
          unLockIcon ? "d-flex justify-content-between align-items-center" : ""
        }`}
      >
        <span style={{ cursor: "pointer" }} onClick={shakeHandler}>
          {title
            ? title !== true
              ? title
              : "Help us by sending some Details:"
            : null}
        </span>{" "}
        {!orderConfirmed ? (
          <BiLock style={{ float: "right" }} id="lock2" />
        ) : unLockIcon ? (
          unLockIcon
        ) : null}
      </h2>
      {orderConfirmed && (
        <div className={Styles.attachContainer}>
          {children ? <div className={Styles.dFlex}>{children}</div> : null}
          <div className={Styles.dFlex}>
            <div className={Styles.descholder}>
              <p className={Styles.subTitle}>Describe your Problem</p>
              <textarea
                name="desc"
                id="desc"
                className={Styles.textAreaPut}
                onKeyUp={(e) => setDesc(e.target.value)}
              ></textarea>
            </div>
            <div className={Styles.attachHolder}>
              <p className={Styles.subTitle}>Upload some attachments</p>

              <label className={Styles.attachLabel} htmlFor="attachement">
                <div>
                  <div className={Styles.attachLabelDiv}>
                    <BiUpload />
                    {/* {files.length > 0 ? (
                      <p className={Styles.countText}>
                       Selected Items: {files.length}
                      </p>
                    ) : (
                      <BiUpload />
                    )} */}
                  </div>
                </div>
              </label>
              <input
                type="file"
                style={{ width: 0, height: 0 }}
                id="attachement"
                onChange={handleChange}
                multiple
              />
            </div>
          </div>
          <div>
            {files.length > 0 && (
              <p className={Styles.countText}>Selected Items: {files.length}</p>
            )}
            </div>
          <div className={Styles.imgHolder}>
            <ImageSlider />
          </div>
          <button className={Styles.btnHolder} onClick={() => setConfirm(true)}>
            <BiSave />
            &nbsp;Submit
          </button>
        </div>
      )}
    </section>
  );
};

export default Attachements;
