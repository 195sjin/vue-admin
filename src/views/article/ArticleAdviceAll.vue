<script setup>
import {
    Edit,
    Delete,
    InfoFilled
} from '@element-plus/icons-vue'

import { ref } from 'vue'

//文章分类数据模型
const categorys = ref([
    {
        "id": 3,
        "categoryName": "美食",
        "categoryAlias": "my",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
    {
        "id": 4,
        "categoryName": "娱乐",
        "categoryAlias": "yl",
        "createTime": "2023-09-02 12:08:16",
        "updateTime": "2023-09-02 12:08:16"
    },
    {
        "id": 5,
        "categoryName": "军事",
        "categoryAlias": "js",
        "createTime": "2023-09-02 12:08:33",
        "updateTime": "2023-09-02 12:08:33"
    }
])

//用户搜索时选中的分类id
const categoryId=ref('')

//用户搜索时选中的发布状态
const state=ref('')

//文章列表数据模型
const articles = ref([
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getArticles()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getArticles()
}

//文章列表查询
import { articleCategoryListService, articleListService, articleAdviceListService, articleAddService, articleDetailService, articleUpdateService, articleDeleteService, articleAdviceService } from '@/api/article.js'
const getArticleCategoryList = async () => {
    //获取所有分类
    let resultC = await articleCategoryListService();
    categorys.value = resultC.data
}

import { ElMessage } from 'element-plus'


//文章列表查询
const getArticles = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await articleAdviceListService(params);
    //渲染列表数据
    articles.value = result.data.items
    //为列表中添加categoryName属性
    for(let i=0;i<articles.value.length;i++){
        let article = articles.value[i];
        for(let j=0;j<categorys.value.length;j++){
            if(article.categoryId===categorys.value[j].id){
                article.categoryName=categorys.value[j].categoryName
            }
        }
    }
    //渲染总条数
    total.value=result.data.total
}
getArticleCategoryList();
getArticles()


import '@vueup/vue-quill/dist/vue-quill.snow.css'






import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore();





// 文章详情相关变量
const detailDialogVisible = ref(false)
const articleDetail = ref({})

// 查看文章详情方法
// 2. 添加审批相关的状态变量
const isAdmin = ref(true) // 实际项目中可能需要从store中获取管理员状态
const approvalState = ref('')
const approvalAdvice = ref('')

// 3. 修改查看文章详情方法，添加审批相关逻辑
const viewArticleDetail = async (id) => {
  try {
    const result = await articleDetailService(id)
    articleDetail.value = result.data
    
    // 添加文章分类名称
    for(let j=0;j<categorys.value.length;j++){
      if(articleDetail.value.categoryId === categorys.value[j].id){
        articleDetail.value.categoryName = categorys.value[j].categoryName
        break
      }
    }
    
    // 确保coverImg字段存在
    if(!articleDetail.value.coverImg){
      articleDetail.value.coverImg = ''
    }
    
    detailDialogVisible.value = true
    // 重置审批表单
    approvalState.value = ''
    approvalAdvice.value = ''
  } catch (error) {
    ElMessage.error('获取文章详情失败')
  }
}

// 4. 添加提交审批的方法
const submitApproval = async () => {
  if (!approvalState.value) {
    ElMessage.warning('请选择审批状态')
    return
  }
  try {
    // 直接使用已有的 articleDetail.value.id 作为文章ID
    await articleAdviceService(
      articleDetail.value.id, 
      approvalState.value, 
      approvalAdvice.value || ''
    )
    ElMessage.success('审批成功')
    // 刷新文章详情和列表
    await viewArticleDetail(articleDetail.value.id)
    getArticles()
  } catch (error) {
    ElMessage.error('审批失败: ' + error.message)
  }
}



</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>已审批列表</span>
                
            </div>
        </template>
        
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="作者" prop="userName"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            // 修改操作列的模板代码
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button :icon="InfoFilled" circle plain type="info" @click="viewArticleDetail(row.id)"></el-button>
              </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5, 10 ,15, 20]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />

        <!-- 文章详情弹窗 -->
        <el-dialog v-model="detailDialogVisible" title="文章详情" width="50%">
          <el-form :model="articleDetail" label-width="100px">
            <el-form-item label="文章标题">
              <el-input v-model="articleDetail.title" disabled></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
              <el-input v-model="articleDetail.categoryName" disabled></el-input>
            </el-form-item>
            <el-form-item label="发表时间">
              <el-input v-model="articleDetail.createTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-input v-model="articleDetail.state" disabled></el-input>
            </el-form-item>
            <el-form-item label="封面图片">
              <img v-if="articleDetail.coverImg" :src="articleDetail.coverImg" style="width: 200px; height: 150px; object-fit: cover;">
              <span v-else>无封面图片</span>
            </el-form-item>
            <el-form-item label="文章内容">
              <div v-html="articleDetail.content" style="min-height: 200px;"></div>
            </el-form-item>
            
            <!-- 5. 添加审批表单部分 -->
            <el-divider v-if="isAdmin"></el-divider>
            <el-form-item v-if="isAdmin" label="审批操作">
              <el-radio-group v-model="approvalState" style="margin-bottom: 10px;">
                <el-radio label="审批成功">审批通过</el-radio>
                <el-radio label="审批失败">审批不通过</el-radio>
              </el-radio-group>
              <el-input
                type="textarea"
                v-model="approvalAdvice"
                placeholder="请输入审批意见"
                rows="4"
                style="margin-bottom: 10px;"
              ></el-input>
              <el-button type="primary" @click="submitApproval">提交审批</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>