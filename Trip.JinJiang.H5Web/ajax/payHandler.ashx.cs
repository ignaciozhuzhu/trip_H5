﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.SessionState;
using Trip.JinJiang.H5;

namespace Trip.JinJiang.H5Web.ajax
{
    /// <summary>
    /// payHandler 的摘要说明
    /// </summary>
    public class payHandler : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                Type type = this.GetType();
                string fn = context.Request["fn"].ToString();
                MethodInfo method = type.GetMethod(fn, BindingFlags.Public | BindingFlags.Instance | BindingFlags.NonPublic);
                method.Invoke(this, null);
            }
            catch (Exception e)
            {
                HttpContext.Current.Response.Write("接口出错!");
            }
        }

        /// <summary>
        /// 绑定银行卡
        /// </summary>
        public void bindcard()
        {
            string memberid = HttpContext.Current.Request["memberid"].ToString();
            string card = HttpContext.Current.Request["card"].ToString();
            HttpContext.Current.Response.Write(Pay.bindcard(memberid, card));
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}