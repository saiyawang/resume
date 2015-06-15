package controllers

import (
	"io"
	"os"

	"github.com/astaxie/beego"
	"github.com/saiyawang/resume/models"
)

type AddResumeController struct {
	beego.Controller
}

func (c *AddResumeController) Get() {

	remoteAddr := c.Ctx.Request.RemoteAddr
	beego.Informational(remoteAddr)
	c.TplNames = "index.tpl"

}

func (c *AddResumeController) UploadResume() {
	c.Ctx.Request.ParseMultipartForm(32 << 20)
	file, handler, err := c.GetFile("uploadresume")
	if err != nil {
		beego.Error(err)
		return
	}
	defer file.Close()
	pwd, _ := os.Getwd()
	beego.Debug(pwd)
	f, err := os.OpenFile(pwd+"/static/files/"+handler.Filename, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0666)
	if err != nil {
		beego.Error(err)
		return
	}
	defer f.Close()
	io.Copy(f, file)

	//	c.Ctx.Redirect(200, "/")
	c.Ctx.WriteString("upload file...ok")
	//	c.Ctx.Redirect(200, "/")

}

func (c *AddResumeController) Submit() {
	var info models.ResumeInfo

	info.Name = c.GetString("name")
	info.Age = c.GetString("age")

	info.Email = c.GetString("email")
	info.Education = c.GetString("education")
	info.Experience = c.GetString("experience")
	info.Phone = c.GetString("phone")
	info.Mobile = c.GetString("mobile")
	info.Comment = c.GetString("comment")

	info.Resumefile = "/static/files/" + c.GetString("resumefile")

	models.NewResume(info)

	c.Ctx.WriteString("add resume...ok")

}
