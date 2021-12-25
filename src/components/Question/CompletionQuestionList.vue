<template>
  <el-card>
    <!-- 添加填空题按钮 -->
    <el-row type="flex" justify="space-between">
      <el-col :span="3">
        <el-button type="default" round @click="handleAdd()"
          >添加填空题
        </el-button>
      </el-col>
      <el-col :span="21">
        <el-form :inline="true" class="demo-form-inline">
          <!-- 选择章节按钮 -->
          <el-form-item class="章节">
            <el-select
              placeholder="请选择"
              class="handle-select"
              v-model="searchChapterChoice"
              @change="searchChapterChange()"
            >
              <el-option
                v-for="(item, index) in searchChapterOptions"
                :key="index"
                :label="item"
                :value="index"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 选择第一知识点 -->
          <el-form-item label="第一知识点">
            <el-select
              placeholder="请选择"
              class="handle-select"
              v-model="searchFirstKnowledgeChoice"
              :disabled="searchFirstKnowledgePointVisiable"
              @change="searchFirstPointChange()"
            >
              <el-option
                v-for="(item, index) in searchFirstKnowledgePointOptions"
                :key="index"
                :label="item"
                :value="index"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 选择第二知识点 -->
          <el-form-item label="第二知识点">
            <el-select
              placeholder="请选择"
              class="handle-select"
              v-model="searchSecondKnowledgeChoice"
              :disabled="searchSecondKnowledgePointVisiable"
            >
              <el-option
                v-for="item in searchSecondKnowledgePointOptions"
                :key="item.questionLabelId"
                :label="item.secondKnowledgePoint"
                :value="item.questionLabelId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 选择教师用户姓名 -->
          <el-form-item label="教师用户姓名">
            <el-select
              placeholder="请选择"
              class="handle-select"
              v-model="searchTeacherUserId"
            >
              <el-option
                v-for="item in teacherUserList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="searchCompletionQuestionInfo()"
              icon="el-icon-search"
              round
              plain
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 填空题列表 -->
    <el-table
      :data="data"
      class="completionQuestionTable"
      stripe
      :header-cell-style="{ 'text-align': 'center' }"
      :row-style="{ height: '20px' }"
      :cell-style="{ padding: '0px' }"
    >
      <el-table-column width="100px" label="在考试中" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isExam == true">√</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="completionQuestionId"
        label="填空题编号"
        align="center"
        width="100px"
      >
      </el-table-column>
      <el-table-column
        prop="user.userName"
        label="创建人"
        width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="completionQuestionDescription"
        label="选择题描述"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="questionLabels[0].chapter"
        label="选择题章节"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="questionLabels[0].firstKnowledgePoint"
        label="选择题一级知识点"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="选择题二级知识点"
        min-width="100%"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div
            v-for="(item, index) in scope.row.questionLabels"
            :key="item.questionLabelId"
          >
            <el-tag
              v-if="index < 3"
              align="center"
              effect="dark"
              type="info"
              size="small"
            >
              {{ item.secondKnowledgePoint }}
            </el-tag>
            <el-tag
              v-if="index == 3"
              align="center"
              effect="dark"
              type="info"
              size="small"
            >
              ...
            </el-tag>
            <span v-if="index > 3"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="completionQuestionDifficulty"
        width="100px"
        label="选择题难度"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="isPrivate" label="是否私有" width="100px">
        <template slot-scope="scope">
          <p v-if="scope.row.isPrivate === true" align="center">私有</p>
          <p v-if="scope.row.isPrivate === false" align="center">公有</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="scope">
          <el-button
            type="default"
            size="mini"
            @click="handleShow(scope.row)"
            icon="el-icon-info"
            round
            plain
            >详情</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope.row)"
            icon="el-icon-edit-outline"
            round
            plain
            :disabled="scope.row.isExam"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="
              deleteCompletionQuestionInfo(scope.row.completionQuestionId)
            "
            icon="el-icon-delete-solid"
            round
            plain
            :disabled="scope.row.isExam"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="completionQuestionInfoList.length"
        @current-change="handleCurrent"
        v-if="completionQuestionInfoList.length != 0"
      >
      </el-pagination>
    </div>

    <!-- 添加填空题弹出框 -->
    <el-dialog
      title="添加填空题"
      :visible.sync="addCompletionQuestionInfoVisible"
      :close-on-click-modal="false"
      center
    >
      <el-form
        :model="aCompletionQuestionInfo"
        label-width="80px"
        ref="aCompletionQuestionInfo"
        label-position="right"
        :rules="addCompletionQuestionSubmitRules"
      >
        <el-form-item prop="completionQuestionDescription" label="题目描述">
          <el-input
            v-model="aCompletionQuestionInfo.completionQuestionDescription"
            placeholder="题目描述"
            type="textarea"
            :autosize="true"
            style="resize: none; font-size: 1.2em"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="completionQuestionAnswers" label="题目答案">
          <el-button-group style="margin-left: 25%">
            <el-button
              type="default"
              icon="el-icon-plus"
              @click="addCompletionQuestionAddSpace()"
              >添加填空</el-button
            >
            <el-button
              type="default"
              @click="addCompletionQuestionDeleteSpace()"
              >删除填空<i class="el-icon-minus el-icon--right"></i
            ></el-button>
          </el-button-group>
          <div
            v-for="(
              item, index
            ) in aCompletionQuestionInfo.completionQuestionAnswers"
            :key="index"
            style="width: 100%; float: left; margin-top: 10px"
          >
            <span>
              答案
              {{
                aCompletionQuestionInfo.completionQuestionAnswers[index]
                  .completionQuestionAnswerNumber
              }}
              :
            </span>
            <el-input
              v-model="
                aCompletionQuestionInfo.completionQuestionAnswers[index]
                  .completionQuestionAnswerContent
              "
              placeholder="题目答案"
              :autosize="true"
              style="display: inline-block; resize: none; width: 80%"
            >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="标签" prop="questionLabels">
          <el-select
            v-model="addCompletionQuestionChapterChoice"
            placeholder="请选择"
            @change="addCompletionQuestionChapterClick()"
            style="margin-left: 10px; width: 45%"
          >
            <el-option
              v-for="(item, index) in chapterList"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="addCompletionQuestionFirstKnowledgeChoice"
            placeholder="请选择"
            :disabled="addCompletionQuestionFirstKnowledgeUse"
            @change="addCompletionQuestionFirstPointClick()"
            style="margin-left: 35px; width: 45%"
          >
            <el-option
              v-for="(item, index) in addCompletionQuestionFirstKnowledgeOption"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="aCompletionQuestionInfo.questionLabels"
            multiple
            placeholder="请选择"
            :disabled="addCompletionQuestionSecondKnowledgeUse"
            style="margin: 10px; width: 96%"
          >
            <el-option
              v-for="item in addCompletionQuestionSecondKnowledgeOption"
              :key="item.questionLabelId"
              :label="item.secondKnowledgePoint"
              :value="item.questionLabelId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="completionQuestionDifficulty" label="题目难度">
          <el-select
            v-model="aCompletionQuestionInfo.completionQuestionDifficulty"
            placeholder="请选择"
            style="margin-left: 10px"
          >
            <el-option
              v-for="item in difficultyOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isPrivate" label="是否私有">
          <el-select
            v-model="aCompletionQuestionInfo.isPrivate"
            style="margin-left: 10px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in isPrivateOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          style="width: 100px; font-size: 1.3em"
          @click="addCompletionQuestionInfo('aCompletionQuestionInfo')"
          >确 定</el-button
        >
        <el-button
          style="font-size: 1.3em; margin-left: 50px"
          @click="addCompletionQuestionInfoVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
    <!-- 填空题详情弹出框 -->
    <div class="e2">
      <el-dialog
        title="填空题详情"
        :visible.sync="showCompletionQuestionInfoVisible"
        :close-on-click-modal="false"
        center
      >
        <!-- 上下分离 -->
        <el-form
          class="completionQuestionShowForm"
          :model="showCompletionQuestionInfo"
          label-width="100px"
          ref="showCompletionQuestionInfo"
          label-position="top"
        >
          <el-form-item prop="completionQuestionDescription" label="题目描述">
            <el-input
              v-model="showCompletionQuestionInfo.completionQuestionDescription"
              type="textarea"
              :autosize="true"
              :disabled="true"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="completionQuestionAnswers" label="题目答案">
            <el-descriptions
              :column="1"
              border
              labelStyle="width:15%;text-align:center;color:black"
            >
              <el-descriptions-item
                v-for="(
                  item, index
                ) in showCompletionQuestionInfo.completionQuestionAnswers"
                :key="index"
              >
                <template slot="label">
                  答案{{
                    showCompletionQuestionInfo.completionQuestionAnswers[index]
                      .completionQuestionAnswerNumber
                  }}
                </template>
                {{
                  showCompletionQuestionInfo.completionQuestionAnswers[index]
                    .completionQuestionAnswerContent
                }}
              </el-descriptions-item>
            </el-descriptions>
            <!-- <div
              v-for="(item,
              index) in showCompletionQuestionInfo.completionQuestionAnswers"
              :key="index"
              style="width:400px;float:left;"
              class="e1"
            >
              <p>
                答案{{
                  showCompletionQuestionInfo.completionQuestionAnswers[index]
                    .completionQuestionAnswerNumber
                }}:
              </p>
              <el-input
                v-model="
                  showCompletionQuestionInfo.completionQuestionAnswers[index]
                    .completionQuestionAnswerContent
                "
                placeholder="题目答案"
                :autosize="true"
                style="resize:none;width:300px;"
                :disabled="true"
              >
              </el-input>
            </div> -->
          </el-form-item>
          <el-form-item prop="chapter" label="所属章节">
            <!-- 初始化页面时不让他初始化没有对应的值 -->
            <el-input
              v-model="showCompletionQuestionInfo.questionLabels[0].chapter"
              type="textarea"
              :autosize="true"
              :disabled="true"
              v-if="showCompletionQuestionInfo.questionLabels.length > 0"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="firstKnowledgePoint" label="第一知识点">
            <el-input
              v-model="
                showCompletionQuestionInfo.questionLabels[0].firstKnowledgePoint
              "
              placeholder="第一知识点"
              type="textarea"
              :autosize="true"
              :disabled="true"
              v-if="showCompletionQuestionInfo.questionLabels.length > 0"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="secondKnowledgePoint" label="第二知识点">
            <el-tag
              type="info"
              effect="dark"
              v-for="(item, index) in showCompletionQuestionInfo.questionLabels"
              :key="index"
            >
              {{ item.secondKnowledgePoint }}
            </el-tag>
          </el-form-item>
          <el-form
            inline
            label-width="80px"
            class="completionQuestionShowFormButtom"
          >
            <el-form-item label="是否私有">
              <el-input
                v-model="showCompletionQuestionInfo.isPrivate"
                type="textarea"
                :disabled="true"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="题目难度" style="margin-left: 50px">
              <el-input
                v-model="
                  showCompletionQuestionInfo.completionQuestionDifficulty
                "
                type="textarea"
                :disabled="true"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </el-form>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="showCompletionQuestionInfoVisible = false"
            >确定</el-button
          >
        </div> -->
      </el-dialog>
    </div>
    <!-- 修改填空题弹出框 -->
    <el-dialog
      title="修改填空题"
      :visible.sync="editCompletionQuestionInfoVisible"
      :close-on-click-modal="false"
      center
    >
      <el-form
        :model="eCompletionQuestionInfo"
        label-width="80px"
        ref="eCompletionQuestionInfo"
        label-position="right"
        :rules="editCompletionQuestionSubmitRules"
      >
        <el-form-item prop="completionQuestionDescription" label="题目描述">
          <el-input
            v-model="eCompletionQuestionInfo.completionQuestionDescription"
            type="textarea"
            :autosize="true"
            style="resize: none; font-size: 1.2em"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="completionQuestionAnswers" label="题目答案">
          <el-button-group style="margin-left: 25%">
            <el-button
              type="default"
              icon="el-icon-plus"
              @click="editCompletionQuestionAddSpace()"
              >添加填空</el-button
            >
            <el-button
              type="default"
              @click="editCompletionQuestionDeleteSpace()"
              >删除填空<i class="el-icon-minus el-icon--right"></i
            ></el-button>
          </el-button-group>

          <div
            v-for="(
              item, index
            ) in eCompletionQuestionInfo.completionQuestionAnswers"
            :key="index"
            style="width: 100%; float: left; margin-top: 10px"
          >
            <span>
              答案{{
                eCompletionQuestionInfo.completionQuestionAnswers[index]
                  .completionQuestionAnswerNumber
              }}:
            </span>
            <el-input
              v-model="
                eCompletionQuestionInfo.completionQuestionAnswers[index]
                  .completionQuestionAnswerContent
              "
              placeholder="题目答案"
              :autosize="true"
              style="display: inline-block; resize: none; width: 80%"
            >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="标签" prop="questionLabels">
          <el-select
            v-model="editCompletionQuestionChapterChoice"
            placeholder="请选择"
            @change="editCompletionQuestionChapterClick()"
            style="margin-left: 10px; width: 45%"
          >
            <el-option
              v-for="(item, index) in chapterList"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="editCompletionQuestionFirstKnowledgeChoice"
            :disabled="editCompletionQuestionFirstKnowledgeUse"
            placeholder="请选择"
            @change="editCompletionQuestionFirstPointClick()"
            style="margin-left: 35px; width: 45%"
          >
            <el-option
              v-for="(
                item, index
              ) in editCompletionQuestionFirstKnowledgeOption"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="eCompletionQuestionInfo.questionLabels"
            multiple
            placeholder="请选择"
            :disabled="editCompletionQuestionSecondKnowledgeUse"
            value-key="questionLabelId"
            style="margin: 10px; width: 96%"
          >
            <el-option
              v-for="item in editCompletionQuestionSecondKnowledgeOption"
              :key="item.questionLabelId"
              :label="item.secondKnowledgePoint"
              :value="item.questionLabelId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="completionQuestionDifficulty" label="题目难度">
          <el-select
            v-model="eCompletionQuestionInfo.completionQuestionDifficulty"
            style="margin-left: 10px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in difficultyOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isPrivate" label="是否私有">
          <el-select
            v-model="eCompletionQuestionInfo.isPrivate"
            style="margin-left: 10px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in isPrivateOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          style="width: 100px; font-size: 1.3em"
          @click="editCompletionQuestionInfo('eCompletionQuestionInfo')"
          >修 改</el-button
        >
        <el-button
          style="font-size: 1.3em; margin-left: 50px"
          @click="editCompletionQuestionInfoVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
    <!-- 填空题删除弹出框 -->
    <!-- <el-dialog
      title="删除选择题"
      :visible.sync="deleteCompletionQuestionVisible"
      center
      width="400px"
    >
      <p style="text-align:center">
        是否确定删除该填空题
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteCompletionQuestionVisible = false"
          >取 消</el-button
        >
        <el-button @click="deleteCompletionQuestionInfo()">确定删除</el-button>
      </div>
    </el-dialog> -->
  </el-card>
</template>

<script>
//答案输入的校验
const validatorAccountNumber = (rule, value, callback) => {
  if (value.length > 0) {
    for (var i = 0; i < value.length; i++) {
      if (value[i].completionQuestionAnswerContent == "") {
        new callback(new Error("请输入答案"));
      }
    }
    callback();
  } else {
    new callback(new Error("至少输入一个答案"));
  }
};
export default {
  data () {
    return {
      //登录用户信息
      user: {
        userId: "",
        userName: "",
      },
      //详情用填空题信息
      showCompletionQuestionInfo: {
        completionQuestionId: "",
        completionQuestionDifficulty: "",
        completionQuestionDescription: "",
        isPrivate: "",
        user: {
          userId: "",
          userName: "",
        },
        completionQuestionAnswers: [],
        questionLabels: [], //下拉框选择(多选)
      },
      //添加填空题信息
      aCompletionQuestionInfo: {
        completionQuestionId: "",
        completionQuestionDifficulty: "",
        completionQuestionDescription: "",
        isPrivate: "",
        user: {
          userId: "",
          userName: "",
        },
        completionQuestionAnswers: [],
        questionLabels: [], //下拉框选择(多选)
      },
      //修改填空题信息
      eCompletionQuestionInfo: {
        completionQuestionId: "",
        completionQuestionDifficulty: "",
        completionQuestionDescription: "",
        isPrivate: "",
        user: {
          userId: "",
          userName: "",
        },
        completionQuestionAnswers: [],
        questionLabels: [], //下拉框选择(多选)
      },
      //添加填空题提交规则
      addCompletionQuestionSubmitRules: {
        completionQuestionDescription: [
          { required: true, message: "请输入填空题内容", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "长度在 1 到 300 个字符",
            trigger: "blur",
          },
        ],
        completionQuestionAnswers: [
          {
            required: true,
            validator: validatorAccountNumber,
            trigger: "blur",
          },
        ],
        questionLabels: [
          { required: true, message: "请选择标签", trigger: "blur" },
        ],
        completionQuestionDifficulty: [
          { required: true, message: "请选择难度", trigger: "blur" },
        ],
        isPrivate: [
          { required: true, message: "请选择是否私有", trigger: "blur" },
        ],
      },
      //修改填空题提交规则
      editCompletionQuestionSubmitRules: {
        completionQuestionDescription: [
          { required: true, message: "请输入填空题内容", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "长度在 1 到 300 个字符",
            trigger: "blur",
          },
        ],
        completionQuestionAnswers: [
          {
            required: true,
            validator: validatorAccountNumber,
            trigger: "blur",
          },
        ],
        questionLabels: [
          { required: true, message: "请选择标签", trigger: "blur" },
        ],
        completionQuestionDifficulty: [
          { required: true, message: "请选择难度", trigger: "blur" },
        ],
        isPrivate: [
          { required: true, message: "请选择是否私有", trigger: "blur" },
        ],
      },
      //下拉选择是否公有或私有
      isPrivateOption: [
        {
          value: true,
          label: "私有",
        },
        {
          value: false,
          label: "公有",
        },
      ],
      //表示难度1-10
      difficultyOption: [
        {
          label: 1,
          value: 1,
        },
        {
          label: 2,
          value: 2,
        },
        {
          label: 3,
          value: 3,
        },
        {
          label: 4,
          value: 4,
        },
        {
          label: 5,
          value: 5,
        },
        {
          label: 6,
          value: 6,
        },
        {
          label: 7,
          value: 7,
        },
        {
          label: 8,
          value: 8,
        },
        {
          label: 9,
          value: 9,
        },
        {
          label: 10,
          value: 10,
        },
      ],
      //添加填空题弹出框显示
      addCompletionQuestionInfoVisible: false,
      addCompletionQuestionChapterChoice: "", //添加填空题时章节选择
      addCompletionQuestionFirstKnowledgeOption: [], //添加填空题第一知识点内容
      addCompletionQuestionFirstKnowledgeUse: true, //添加填空题时第一知识点能否使用
      addCompletionQuestionFirstKnowledgeChoice: "", //添加填空题时第一知识点选择
      addCompletionQuestionSecondKnowledgeOption: [], //添加填空题时第二知识点内容
      addCompletionQuestionSecondKnowledgeUse: true, //添加填空题时第二知识点能否使用
      //填空题详情弹出框显示
      showCompletionQuestionInfoVisible: false,
      //填空题修改弹出框显示
      editCompletionQuestionInfoVisible: false,
      editCompletionQuestionChapterChoice: "", //修改填空题时章节选择
      editCompletionQuestionFirstKnowledgeOption: [], //修改填空题第一知识点内容
      editCompletionQuestionFirstKnowledgeUse: false, //修改填空题时第一知识点能否使用
      editCompletionQuestionFirstKnowledgeChoice: "", //修改填空题时第一知识点选择
      editCompletionQuestionSecondKnowledgeOption: [], //修改填空题时第二知识点内容
      editCompletionQuestionSecondKnowledgeUse: false, //修改填空题时第二知识点能否使用
      //删除填空题弹出框显示
      deleteCompletionQuestionVisible: false,
      deleteCompletionQuestionId: "", //要删除的填空题编号

      teacherUserList: [], //教师用户列表
      searchChapterOptions: [], //查询用章节信息
      searchFirstKnowledgePointOptions: [], //查询用第一知识点
      searchSecondKnowledgePointOptions: [], //查询用第二知识点
      searchChapterChoice: "", //查询时的章节选择
      searchFirstKnowledgeChoice: "", //查询时的第一知识点选择
      searchSecondKnowledgeChoice: "", //查询时的第二知识点选择
      searchTeacherUserId: "", //查询时的教师用户名称选择
      searchFirstKnowledgePointVisiable: true, //查询时第一知识点下拉框能否使用 true为禁用
      searchSecondKnowledgePointVisiable: true, //查询时第二知识点下拉框能否使用 true为禁用

      completionQuestionInfoList: [],
      chapterList: [], //章节内容
      pageSize: 4,
      currentPage: 1,
    };
  },
  computed: {
    data () {
      return this.completionQuestionInfoList.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
  },
  mounted: function () {
    //获取填空题信息
    this.getCompletionQuestionInfo();
    //获取章节信息
    this.getQuestionLabelInfo();
    //获取当前教师信息
    this.getCurrentTeacherUserInfo();
    //获取查询选择题标签信息
    this.getSearchQuestionLabelInfo();
    //获取全部教师信息
    this.getTeacherUserInfo();
  },
  methods: {
    //查询填空题信息
    searchCompletionQuestionInfo () {
      let params = new URLSearchParams();
      if (this.searchTeacherUserId == "") {
        params.append("userId", 0);
      } else {
        params.append("userId", this.searchTeacherUserId);
      }
      if (
        (this.searchChapterChoice == "" && this.searchChapterChoice != "0") ||
        this.searchChapterChoice == " "
      ) {
        params.append("chapter", "");
      } else {
        params.append(
          "chapter",
          this.searchChapterOptions[this.searchChapterChoice]
        );
      }
      if (
        (this.searchFirstKnowledgeChoice == "" &&
          this.searchFirstKnowledgeChoice != "0") ||
        this.searchFirstKnowledgeChoice == " "
      ) {
        params.append("firstKnowledge", "");
      } else {
        params.append(
          "firstKnowledge",
          this.searchFirstKnowledgePointOptions[this.searchFirstKnowledgeChoice]
        );
      }
      if (
        this.searchSecondKnowledgeChoice == "" ||
        this.searchSecondKnowledgeChoice == " "
      ) {
        params.append("questionLabelId", 0);
      } else {
        params.append("questionLabelId", this.searchSecondKnowledgeChoice);
      }
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/completionQuestion/queryCompletionQuestionInfoBySearchInfo",
        data: params,
      })
        .then((res) => {
          this.currentPage = 1;
          this.completionQuestionInfoList = res.data;
        })
        .catch((err) => {
          this.$message.error("查询填空题信息错误");
        });
    },
    //获取全部教师信息
    getTeacherUserInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/user/queryTeacherUserInfo",
        data: params,
      })
        .then((res) => {
          var teacherUser = new Object();
          teacherUser.userId = "";
          teacherUser.userName = "";
          this.teacherUserList = res.data;
          this.teacherUserList.unshift(teacherUser);
        })
        .catch((err) => {
          this.$message.error("系统错误请稍后再尝试");
        });
    },
    //查询时点击第一知识点
    searchFirstPointChange () {
      //查询时第二知识点可以使用  第二知识点选择为空
      if (
        this.searchFirstKnowledgePointOptions[
        this.searchFirstKnowledgeChoice
        ] != " "
      ) {
        this.searchSecondKnowledgePointVisiable = false;
        this.searchSecondKnowledgeChoice = "";
        this.getSearchSecondKnowledgePointInfo(
          this.searchChapterOptions[this.searchChapterChoice],
          this.searchFirstKnowledgePointOptions[this.searchFirstKnowledgeChoice]
        );
      } else {
        this.searchSecondKnowledgePointVisiable = true;
        this.searchSecondKnowledgeChoice = "";
      }
    },
    //查询章节变化时
    searchChapterChange () {
      //不为空时 查询时第一知识点可以使用 第二知识点禁用 第一知识点和第二知识点选择为空
      if (this.searchChapterOptions[this.searchChapterChoice] != " ") {
        this.searchFirstKnowledgePointVisiable = false;
        this.searchSecondKnowledgePointVisiable = true;
        this.searchSecondKnowledgeChoice = "";
        this.searchFirstKnowledgeChoice = "";
        //获取查询第一知识点的数据
        this.getSearchFirstKnowledgePointInfo(
          this.searchChapterOptions[this.searchChapterChoice]
        );
      } else {
        this.searchFirstKnowledgePointVisiable = true;
        this.searchSecondKnowledgePointVisiable = true;
        this.searchSecondKnowledgeChoice = "";
        this.searchFirstKnowledgeChoice = "";
      }
    },
    //获取查询第一知识点信息
    getSearchFirstKnowledgePointInfo (chapter) {
      let params = new URLSearchParams(chapter);
      params.append("chapter", chapter);
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/questionLabel/queryFirstKnowledgePointInfoByChapter",
        data: params,
      })
        .then((res) => {
          //给下拉框内容清空 并初始化
          this.searchFirstKnowledgePointOptions = [];
          this.searchFirstKnowledgePointOptions = res.data;
          if (this.searchFirstKnowledgePointOptions.length > 0) {
            var firstKnowledgePoint = new Object();
            firstKnowledgePoint = " ";
            this.searchFirstKnowledgePointOptions.unshift(firstKnowledgePoint);
          }
        })
        .catch((err) => {
          this.$message.error("获取查询第一知识点错误");
        });
    },
    //获取查询第二知识点
    getSearchSecondKnowledgePointInfo (chapter, firstKnowledgePoint) {
      let params = new URLSearchParams();
      params.append("chapter", chapter);
      params.append("firstKnowledgePoint", firstKnowledgePoint);
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/questionLabel/querySecondKnowledgePointInfoByChapter",
        data: params,
      })
        .then((res) => {
          //给下拉框内容清空 并初始化
          this.searchSecondKnowledgePointOptions = [];
          this.searchSecondKnowledgePointOptions = res.data;
          if (this.searchSecondKnowledgePointOptions.length > 0) {
            var secondKnowledgePoint = new Object();
            secondKnowledgePoint.secondKnowledgePoint = " ";
            secondKnowledgePoint.questionLabelId = 0;
            this.searchSecondKnowledgePointOptions.unshift(
              secondKnowledgePoint
            );
          }
        })
        .catch((err) => {
          this.$message.error("获取查询第二知识点错误");
        });
    },
    //获取查询标签信息(获取chapter)
    getSearchQuestionLabelInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/questionLabel/queryChapterInfo",
        data: params,
      })
        .then((res) => {
          //初始化
          this.searchChapterOptions = res.data;
          if (this.searchChapterOptions.length > 0) {
            var chapter = new Object();
            chapter = " ";
            this.searchChapterOptions.unshift(chapter);
          }
        })
        .catch((err) => {
          this.$message.error("获取查询章节信息错误");
        });
    },
    //跳转页面调用
    handleCurrent (val) {
      this.currentPage = val;
    },
    //添加填空题信息添加填空
    addCompletionQuestionAddSpace () {
      var completionQuestionAnswer = new Object();
      completionQuestionAnswer.completionQuestionAnswerNumber =
        this.aCompletionQuestionInfo.completionQuestionAnswers.length + 1;
      completionQuestionAnswer.completionQuestionAnswerContent = "";
      this.aCompletionQuestionInfo.completionQuestionAnswers.push(
        completionQuestionAnswer
      );
    },
    //添加填空题信息删除填空
    addCompletionQuestionDeleteSpace () {
      this.aCompletionQuestionInfo.completionQuestionAnswers.splice(
        this.aCompletionQuestionInfo.completionQuestionAnswers.length - 1,
        1
      );
    },
    //修改填空题信息添加填空
    editCompletionQuestionAddSpace () {
      var completionQuestionAnswer = new Object();
      completionQuestionAnswer.completionQuestionAnswerNumber =
        this.eCompletionQuestionInfo.completionQuestionAnswers.length + 1;
      completionQuestionAnswer.completionQuestionAnswerContent = "";
      this.eCompletionQuestionInfo.completionQuestionAnswers.push(
        completionQuestionAnswer
      );
    },
    //修改填空题信息删除填空
    editCompletionQuestionDeleteSpace () {
      this.eCompletionQuestionInfo.completionQuestionAnswers.splice(
        this.eCompletionQuestionInfo.completionQuestionAnswers.length - 1,
        1
      );
    },
    //修改填空题信息
    editCompletionQuestionInfo (eCompletionQuestionInfo) {
      this.$refs[eCompletionQuestionInfo].validate((valid) => {
        //开启校验
        if (valid) {
          // 如果校验通过，请求接口，允许提交表单
          let params = new URLSearchParams();
          for (
            var i = 0;
            i < this.eCompletionQuestionInfo.questionLabels.length;
            i++
          ) {
            var questionLabel = new Object();
            questionLabel.questionLabelId = this.eCompletionQuestionInfo.questionLabels[
              i
            ];
            this.eCompletionQuestionInfo.questionLabels[i] = questionLabel;
          }
          this.eCompletionQuestionInfo.user = this.user;
          params.append(
            "completionQuestionInfo",
            JSON.stringify(this.eCompletionQuestionInfo)
          );
          this.$axios({
            method: "post",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            url: "/completionQuestion/modifyCompletionQuestionInfo",
            data: params,
          })
            .then((res) => {
              if (res.data == true) {
                this.$message.success("修改填空题成功");
                this.editCompletionQuestionInfoVisible = false;
                this.getCompletionQuestionInfo();
              } else if (res.data == false) {
                this.$message.error("修改填空题失败");
              } else {
                this.$message.error("系统错误");
              }
            })
            .catch((err) => {
              this.$message.error("修改填空题错误");
            });
          //校验不通过
        } else {
          //界面会显示
        }
      });
    },
    //添加填空题信息
    addCompletionQuestionInfo (aCompletionQuestionInfo) {
      this.$refs[aCompletionQuestionInfo].validate((valid) => {
        //开启校验 不管标题和分数是否通过都要判断表单里的数据
        if (valid) {
          // 如果校验通过，请求接口，允许提交表单
          let params = new URLSearchParams();
          for (var i = 0; i < this.aCompletionQuestionInfo.questionLabels.length; i++) {
            var questionLabel = new Object();
            questionLabel.questionLabelId = this.aCompletionQuestionInfo.questionLabels[
              i
            ];
            this.aCompletionQuestionInfo.questionLabels[i] = questionLabel;
          }
          this.aCompletionQuestionInfo.user = this.user;
          params.append("completionQuestionInfo", JSON.stringify(this.aCompletionQuestionInfo));
          this.$axios({
            method: "post",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            url: "/completionQuestion/addCompletionQuestionInfo",
            data: params,
          })
            .then((res) => {
              if (res.data == true) {
                this.$message.success("添加填空题成功");
                this.addCompletionQuestionInfoVisible = false;
                this.getCompletionQuestionInfo();
              } else if (res.data == false) {
                this.$message.error("添加填空题失败");
              } else {
                this.$message.error("系统错误");
              }
            })
            .catch((err) => {
              this.$message.error("添加填空题错误");
            });
          //校验不通过
        } else {
          //界面会显示
        }
      });
    },
    //删除填空题信息
    async deleteCompletionQuestionInfo (completionQuestionId) {
      let params = new URLSearchParams();
      params.append("completionQuestionId", completionQuestionId);
      const confirmResult = await this.$confirm(
        "是否确定删除该填空题 ?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url:
          "/completionQuestion/deleteCompletionQuestionInfoByCompletionQuestionId",
        data: params,
      })
        .then((res) => {
          if (res.data == true) {
            this.$message.success("删除填空题成功");
            this.deleteCompletionQuestionVisible = false;
            this.getCompletionQuestionInfo();
          } else if (res.data == false) {
            this.$message.error("删除填空题失败");
          } else {
            this.$message.error("系统错误");
          }
        })
        .catch((err) => {
          this.$message.error("删除填空题错误");
        });
    },
    //获取填空题信息
    getCompletionQuestionInfo () {
      let params = new URLSearchParams();
      params.append("userId", 0);
      params.append("chapter", "");
      params.append("firstKnowledge", "");
      params.append("questionLabelId", 0);
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/completionQuestion/queryCompletionQuestionInfoBySearchInfo",
        data: params,
      })
        .then((res) => {
          this.completionQuestionInfoList = res.data;
        })
        .catch((err) => {
          this.$message.error("查询填空题错误");
        });
    },
    //获取标签信息(获取chapter)
    getQuestionLabelInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/questionLabel/queryChapterInfo",
        data: params,
      })
        .then((res) => {
          //初始化
          this.chapterList = res.data;
        })
        .catch((err) => {
          this.$message.error("获取章节信息错误");
        });
    },
    //添加填空题点击章节信息
    addCompletionQuestionChapterClick () {
      //解除第一知识点的禁用,赋值第一知识点选择为空 第二知识点为空并禁用
      this.addCompletionQuestionFirstKnowledgeUse = false;
      this.addCompletionQuestionFirstKnowledgeChoice = "";
      this.addCompletionQuestionSecondKnowledgeUse = true;
      this.aCompletionQuestionInfo.questionLabels = "";
      let params = new URLSearchParams();
      params.append(
        "chapter",
        this.chapterList[this.addCompletionQuestionChapterChoice]
      );
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/questionLabel/queryFirstKnowledgePointInfoByChapter",
        data: params,
      })
        .then((res) => {
          this.addCompletionQuestionFirstKnowledgeOption = res.data;
        })
        .catch((err) => {
          this.$message.error("添加填空题获取第一知识点错误");
        });
    },
    //修改填空题点击章节信息
    editCompletionQuestionChapterClick () {
      //解除第一知识点的禁用,赋值第一知识点选择为空 第二知识点为空并禁用
      this.editCompletionQuestionFirstKnowledgeUse = false;
      this.editCompletionQuestionFirstKnowledgeChoice = "";
      this.editCompletionQuestionSecondKnowledgeUse = true;
      this.eCompletionQuestionInfo.questionLabels = "";
      let params = new URLSearchParams();
      params.append(
        "chapter",
        this.chapterList[this.editCompletionQuestionChapterChoice]
      );
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/questionLabel/queryFirstKnowledgePointInfoByChapter",
        data: params,
      })
        .then((res) => {
          this.editCompletionQuestionFirstKnowledgeOption = res.data;
        })
        .catch((err) => {
          this.$message.error("添加填空题获取第一知识点错误");
        });
    },
    //添加填空题点击第一知识点
    addCompletionQuestionFirstPointClick () {
      //第二知识点的禁用解除 赋值第二知识点选择为空
      this.addCompletionQuestionSecondKnowledgeUse = false;
      this.aCompletionQuestionInfo.questionLabels = "";
      let params = new URLSearchParams();
      params.append(
        "chapter",
        this.chapterList[this.addCompletionQuestionChapterChoice]
      );
      params.append(
        "firstKnowledgePoint",
        this.addCompletionQuestionFirstKnowledgeOption[
        this.addCompletionQuestionFirstKnowledgeChoice
        ]
      );
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/questionLabel/querySecondKnowledgePointInfoByChapter",
        data: params,
      })
        .then((res) => {
          this.addCompletionQuestionSecondKnowledgeOption = res.data;
        })
        .catch((err) => {
          this.$message.error("添加填空题获取第二知识点错误");
        });
    },
    //修改填空题点击第一知识点
    editCompletionQuestionFirstPointClick () {
      //第二知识点的禁用解除 赋值第二知识点选择为空
      this.editCompletionQuestionSecondKnowledgeUse = false;
      this.eCompletionQuestionInfo.questionLabels = "";
      let params = new URLSearchParams();
      params.append(
        "chapter",
        this.chapterList[this.editCompletionQuestionChapterChoice]
      );
      params.append(
        "firstKnowledgePoint",
        this.editCompletionQuestionFirstKnowledgeOption[
        this.editCompletionQuestionFirstKnowledgeChoice
        ]
      );
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/questionLabel/querySecondKnowledgePointInfoByChapter",
        data: params,
      })
        .then((res) => {
          this.editCompletionQuestionSecondKnowledgeOption = res.data;
          console.log(res.data);
        })
        .catch((err) => {
          this.$message.error("添加填空题获取第二知识点错误");
        });
    },
    //获取当前教师用户信息
    getCurrentTeacherUserInfo () {
      let params = new URLSearchParams();
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/user/queryUserInfo",
        data: params,
      })
        .then((res) => {
          this.user = res.data;
        })
        .catch((err) => {
          this.$message.error("系统错误请稍后再尝试");
        });
    },
    //控制详情弹出框显示
    handleShow (row) {
      //详情弹出框显示 赋值  不能直接赋值row row类似一个指针直接指向row了
      this.showCompletionQuestionInfoVisible = true;
      this.showCompletionQuestionInfo.completionQuestionDescription =
        row.completionQuestionDescription;
      this.showCompletionQuestionInfo.completionQuestionDifficulty =
        row.completionQuestionDifficulty;
      this.showCompletionQuestionInfo.completionQuestionAnswers =
        row.completionQuestionAnswers;
      this.showCompletionQuestionInfo.questionLabels = row.questionLabels;
      if (row.isPrivate == true) {
        this.showCompletionQuestionInfo.isPrivate = "私有";
      } else {
        this.showCompletionQuestionInfo.isPrivate = "公有";
      }
    },
    //控制修改弹出框显示
    handleEdit (row) {
      alert(row.completionQuestionId);
      //先清空数据
      this.eCompletionQuestionInfo.questionLabels = [];
      //详情弹出框显示 赋值  不能直接赋值row row类似一个指针直接指向row了
      this.editCompletionQuestionInfoVisible = true;
      this.eCompletionQuestionInfo.completionQuestionId =
        row.completionQuestionId;
      this.eCompletionQuestionInfo.completionQuestionDescription =
        row.completionQuestionDescription;
      this.eCompletionQuestionInfo.completionQuestionDifficulty =
        row.completionQuestionDifficulty;
      this.eCompletionQuestionInfo.completionQuestionAnswers =
        row.completionQuestionAnswers;
      for (var i = 0; i < row.questionLabels.length; i++) {
        this.eCompletionQuestionInfo.questionLabels.push(
          row.questionLabels[i].questionLabelId
        );
      }
      this.eCompletionQuestionInfo.isPrivate = row.isPrivate;

      this.editCompletionQuestionChapterChoice = row.questionLabels[0].chapter;
      this.editCompletionQuestionFirstKnowledgeChoice =
        row.questionLabels[0].firstKnowledgePoint;
      for (var i = 0; i < this.chapterList.length; i++) {
        if (this.chapterList[i] == row.questionLabels[0].chapter) {
          this.editCompletionQuestionChapterChoice = i;
        }
      }
      this.editCompletionQuestionGetFirstKnowledgeInfo(row);
    },
    //删除弹出框显示
    handleDelete (row) {
      //先清空
      this.deleteCompletionQuestionId = "";
      //再赋值
      this.deleteCompletionQuestionVisible = true;
      this.deleteCompletionQuestionId = row.completionQuestionId;
    },
    //添加弹出框显示
    handleAdd () {
      this.addCompletionQuestionChapterChoice = "";
      this.addCompletionQuestionFirstKnowledgeChoice = "";
      this.aCompletionQuestionInfo.completionQuestionDifficulty = "";
      this.aCompletionQuestionInfo.completionQuestionDescription = "";
      this.aCompletionQuestionInfo.isPrivate = "";
      this.aCompletionQuestionInfo.completionQuestionAnswers = [];
      this.aCompletionQuestionInfo.questionLabels = [];
      this.addCompletionQuestionInfoVisible = true;
    },
    //修改填空题信息时获取第一知识点
    editCompletionQuestionGetFirstKnowledgeInfo (row) {
      let params = new URLSearchParams();
      params.append(
        "chapter",
        this.chapterList[this.editCompletionQuestionChapterChoice]
      );
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/questionLabel/queryFirstKnowledgePointInfoByChapter",
        data: params,
      })
        .then((res) => {
          this.editCompletionQuestionFirstKnowledgeOption = res.data;
          for (
            var i = 0;
            i < this.editCompletionQuestionFirstKnowledgeOption.length;
            i++
          ) {
            if (
              this.editCompletionQuestionFirstKnowledgeOption[i] ==
              row.questionLabels[0].firstKnowledgePoint
            ) {
              this.editCompletionQuestionFirstKnowledgeChoice = i;
            }
          }
          this.editCompletionQuestionGetSecondKnowledgeInfo();
        })
        .catch((err) => {
          this.$message.error("修改填空题获取第一知识点错误");
        });
    },
    //修改填空题信息时获取第二知识点
    editCompletionQuestionGetSecondKnowledgeInfo () {
      let params = new URLSearchParams();
      params.append(
        "chapter",
        this.chapterList[this.editCompletionQuestionChapterChoice]
      );
      params.append(
        "firstKnowledgePoint",
        this.editCompletionQuestionFirstKnowledgeOption[
        this.editCompletionQuestionFirstKnowledgeChoice
        ]
      );
      this.$axios({
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/questionLabel/querySecondKnowledgePointInfoByChapter",
        data: params,
      })
        .then((res) => {
          this.editCompletionQuestionSecondKnowledgeOption = res.data;
        })
        .catch((err) => {
          this.$message.error("修改填空题获取第二知识点错误");
        });
    },
  },
};
</script>

<style lang="less" scoped>
/* 详情弹出框的input 禁用样式 */
// .e2 .el-textarea.is-disabled .el-textarea__inner {
//   background-color: white;
//   border-color: white;
//   color: black;
//   cursor: default;
//   /* 下拉框禁止*/
//   resize: none;
//   padding: 0;
// }
/*详情内的答案的禁用样式 */
// .e1 .el-input .el-input__inner {
//   background-color: white;
//   border-color: white;
//   color: black;
//   cursor: default;
// }
/* 分页的css样式 */
.pagination {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
.completionQuestionTable {
  .el-tag {
    float: left;
    margin: 3px 2px 2px 0;
  }
}
/* 选择题详情页样式 */
.completionQuestionShowForm {
  .el-form-item__content {
    line-height: 30px;
  }
  .el-textarea.is-disabled {
    width: 100%;
  }
  .el-textarea.is-disabled {
    .el-textarea__inner {
      background-color: white;
      color: black;
      font-size: 1.1em;
      height: 40px;
      line-height: 1.1em;
      // border-color: white;
      cursor: default;
      /* 下拉框禁止*/
      resize: none;
    }
  }
  .el-form-item__label {
    color: black;
    font-size: 1.2em;
  }
  .el-tag:first-child {
    margin-left: 20px;
  }
  .el-tag {
    margin: 4px 10px;
    float: left;
    font-size: 1.1em;
  }
  //   .completionQuestionShowFormButtom > :first-child {
  //     .el-form-item__label {
  //       padding-right: 30px;
  //     }
  //     .el-textarea {
  //       margin-left: 0;
  //     }
  //   }
}
.completionQuestionShowFormButtom {
  .el-textarea.is-disabled {
    margin-top: 5px;
  }
  .el-textarea.is-disabled {
    .el-textarea__inner {
      height: 30px;
    }
  }
}
.el-card {
  border: 1px solid #7c7979;
}
</style>
