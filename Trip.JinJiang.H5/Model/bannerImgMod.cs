﻿using System;
namespace Trip.JinJiang.H5.Model
{
    /// <summary>
    /// bannerImgMod:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class bannerImgMod
    {
        public bannerImgMod()
        { }
        #region Model
        private int _id;
        private string _alt;
        private string _imgurl;
        private bool _status = true;
        /// <summary>
        /// 自增主键
        /// </summary>
        public int Id
        {
            set { _id = value; }
            get { return _id; }
        }
        /// <summary>
        /// 图片描述
        /// </summary>
        public string alt
        {
            set { _alt = value; }
            get { return _alt; }
        }
        /// <summary>
        /// 相对路径
        /// </summary>
        public string imgUrl
        {
            set { _imgurl = value; }
            get { return _imgurl; }
        }
        /// <summary>
        /// 状态(0禁用,1可用)
        /// </summary>
        public bool status
        {
            set { _status = value; }
            get { return _status; }
        }
        #endregion Model

    }
}
