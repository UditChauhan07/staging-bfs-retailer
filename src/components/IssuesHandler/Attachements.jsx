import { BiLock, BiSave, BiUpload } from "react-icons/bi";
import Styles from "./Attachements.module.css";
import { BsFillEyeFill } from "react-icons/bs";

const Attachements = ({files,setFile,setDesc,orderConfirmed,SubmitHandler}) => {
    function handleChange(e) {
        let tempFile = [];
        let reqfiles = e.target.files;
        if(reqfiles){
            if(reqfiles.length>0){
                Object.keys(reqfiles).map((index)=>{
                    let url =URL.createObjectURL(reqfiles[index])
                    if(url){
                        tempFile.push({preview:url,file:reqfiles[index]});
                    }
                    // this thoughing me Failed to execute 'createObjectURL' on 'URL': Overload resolution failed?
                })
            }
        }
        setFile(tempFile);
    }
    const handleFileChange = (event) => {
        const files = event.target.files;
        const images = [];
      
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
      
          reader.onload = (event) => {
            images.push(event.target.result);
          };
      
          reader.readAsDataURL(file);
        }
        console.log({images});
      };
      const shakeHandler=()=>{
        let lock1 = document.getElementById("lock2");
        if(lock1){
            setTimeout(()=>{
                lock1.classList.remove(Styles.shake);
            },300)
            lock1.classList.add(Styles.shake)
        }
    }
    return (<section style={{borderBottom:'1px solid #ccc'}} id="AttachementSection">
        <h2 className={Styles.reasonTitle}><span style={{cursor:"pointer"}} onClick={shakeHandler}>Help us by sending some Details:</span> {!orderConfirmed && <BiLock style={{float:'right'}} id="lock2"/>}</h2>
        {orderConfirmed &&
        <div className={Styles.attachContainer}>
        <div className={Styles.dFlex}>
            <div className={Styles.attachHolder}>
                <p className={Styles.subTitle}>upload some attachments</p>
                <label className={Styles.attachLabel} for="attachement"><div><div className={Styles.attachLabelDiv}><BiUpload/></div></div></label>
                <input type="file" style={{width:0,height:0}} id="attachement" onChange={handleChange} multiple  accept="image/*"/>
                <div className={Styles.imgHolder}>
                {files.map((file,index)=>(
                    <a href={file?.preview} title="Click to Download">
                        <img src={file?.preview} key={index} alt={file?.preview}/>
                    </a>
                ))}
                </div>
            </div>
            <div className={Styles.descholder}>
                <p className={Styles.subTitle}>Describe you Problem</p>
                <textarea name="desc" id="" className={Styles.textAreaPut} onKeyUp={(e)=>setDesc(e.target.value)}></textarea>
            </div>
        </div>
        <button className={Styles.btnHolder} onClick={SubmitHandler}><BiSave/>&nbsp;Submit</button>
        </div>}
    </section>)
}
export default Attachements;