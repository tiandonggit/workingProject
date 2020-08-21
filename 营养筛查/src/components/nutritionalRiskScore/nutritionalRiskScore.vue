/*
 * @Author: 田东 
 * @Date: 2020-04-13 09:48:35 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-04-15 09:32:57
 * @name 分数文案组件
 */

<template>
  <div class="nutritionalRiskScore">
    <div v-if="score == '0'" class="block">
      <img src="../../assets/img/risk_0.png" alt />
      <p class="title">患者营养筛查评估正常！</p>
      <p>
        营养状态良好，不需要干预，
        <br />疾病治疗期间每周复查营养风险筛查
      </p>
    </div>
    <div v-if="score == '1'" class="block">
      <img src="../../assets/img/risk_1.png" alt />
      <p class="title">患者营养筛查评估暂无风险！</p>
      <p>
        较低营养风险，
        <br />蛋白质需要量略增加,可以通过口服补充来弥补。
        <br />疾病治疗期间每周复查营养风险筛查
      </p>
    </div>
    <div v-if="score == '2'" class="block">
      <img src="../../assets/img/risk_2.png" alt />
      <p class="title">患者有一定营养风险！</p>
      <p>
        有一定营养风险，蛋白质需要量相应增加,
        <br />可以通过人工营养支持得到恢复
        <br />（根据疾病及严重程度考虑选择补充
        <br />动物源性蛋白和/或植物源性蛋白，
        <br />请咨询您的主管医生），如果不及时改善，
        <br />可能导致疾病恢复延迟，住院时间延长。
        <br />疾病治疗期间每周复查营养风险筛查
      </p>
    </div>
    <div v-if="score == '3'" class="block">
      <img src="../../assets/img/risk_3.png" alt />
      <p class="title">患者处于营养风险！</p>
      <p>
        处于营养风险，蛋白质需要量大量增加，
        <br />必需马上开展营养治疗纠正，
        <br />否则可能导致并发症增多，
        <br />病程延长，甚至预后不良
        <br />（根据疾病及严重程度考虑选择补充
        <br />动物源性蛋白和/或植物源性蛋白，
        <br />请咨询您的主管医生），必要时请营养科会诊。
      </p>
    </div>
    <div v-if="score >= '4'" class="block">
      <img :src="require(`../../assets/img/risk_${score}.png`)" alt />
      <p class="title">患者处于严重营养风险！</p>
      <p>
        蛋白质需要量明显增加，
        <br />可能通过肠外或肠内营养治疗不能完全纠正。
        <br />必需马上开展营养治疗，及时请营养科会诊。
        <br />否则可能导致并发症增多，严重预后不良。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "nutritionalRiskScore",
  props: {
    score: {
      type: String,
      default() {
        return null;
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.nutritionalRiskScore {
  .block {

    img {
      display: block;
      width: 215px;
      margin: 70px auto 51px;
    }

    p {
      text-align: center;
      margin-bottom: 12px;
      padding: 0 15px;
      font-size: 16px;
      font-weight: 400;
      color: @fontColor99;
      line-height: 20px;
    }

    p.title {
      font-size: 18px;
      font-weight: bold;
      color: @fontColor33;
      line-height: 22px;
    }
  }
}
</style>
