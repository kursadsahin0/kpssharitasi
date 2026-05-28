import { questionsBatch1 } from '../questions-batch1.js'
import { questionsBatch2 } from '../questions-batch2.js'
import { questionsBatch3 } from '../questions-batch3.js'
import { questionsBatch4 } from '../questions-batch4.js'
import { questionsBatch5 } from '../questions-batch5.js'
import { questionsBatch6 } from '../questions-batch6.js'
import { questionsBatch7 } from '../questions-batch7.js'
import { questionsBatch8 } from '../questions-batch8.js'
import { questionsBatch9 } from '../questions-batch9.js'
import { questionsBatch10 } from '../questions-batch10.js'
import { questionsBatch11 } from '../questions-batch11.js'
import { questionsBatch12 } from '../questions-batch12.js'
import { questionsCografyaBatch1 } from '../questions-cografya-batch1.js'
import { questionsCografyaBatch2 } from '../questions-cografya-batch2.js'
import { questionsCografyaBatch3 } from '../questions-cografya-batch3.js'
import { questionsCografyaBatch4 } from '../questions-cografya-batch4.js'
import { questionsVatandaslikBatch1 } from '../questions-vatandaslik-batch1.js'
import { questionsVatandaslikBatch2 } from '../questions-vatandaslik-batch2.js'
import { questionsVatandaslikBatch3 } from '../questions-vatandaslik-batch3.js'
import { questionsVatandaslikBatch4 } from '../questions-vatandaslik-batch4.js'
import { questionsVatandaslikBatch5 } from '../questions-vatandaslik-batch5.js'
import { questionsVatandaslikBatch6 } from '../questions-vatandaslik-batch6.js'
import { questionsVatandaslikBatch7 } from '../questions-vatandaslik-batch7.js'
import { withoutMapQuestions } from 'src/utils/mapQuestionFilter'

const allQuestions = [
  ...questionsBatch1,
  ...questionsBatch2,
  ...questionsBatch3,
  ...questionsBatch4,
  ...questionsBatch5,
  ...questionsBatch6,
  ...questionsBatch7,
  ...questionsBatch8,
  ...questionsBatch9,
  ...questionsBatch10,
  ...questionsBatch11,
  ...questionsBatch12,
  ...questionsCografyaBatch1,
  ...questionsCografyaBatch2,
  ...questionsCografyaBatch3,
  ...questionsCografyaBatch4,
  ...questionsVatandaslikBatch1,
  ...questionsVatandaslikBatch2,
  ...questionsVatandaslikBatch3,
  ...questionsVatandaslikBatch4,
  ...questionsVatandaslikBatch5,
  ...questionsVatandaslikBatch6,
  ...questionsVatandaslikBatch7,
]

/** Harita/şekil gerektiren sorular quiz havuzuna alınmaz */
export const questions = withoutMapQuestions(allQuestions)
