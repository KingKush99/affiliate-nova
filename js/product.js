async function run(){const qs=new URLSearchParams(location.search);const id=qs.get('id');const res=await fetch('data/merch.json');const data=await res.json();const item=data.find(d=>d.id===id)||data[0];
document.title=item.name+' — Product';document.getElementById('root').innerHTML=`
<section class='rounded-2xl overflow-hidden border border-white/10 bg-[#111827]' style='background:${item.color}22'>
  <div class='grid md:grid-cols-2 gap-0'>
    <img src='${item.image}' class='w-full h-full object-cover'>
    <div class='p-6'>
      <h1 class='text-2xl font-bold mb-1'>${item.name}</h1>
      <div class='text-slate-300 mb-2'>${item.tagline}</div>
      <div class='text-xl mb-3'>${item.price}</div>
      <button class='px-4 py-3 rounded-xl bg-[#22c55e] text-black'>Add to Cart</button>
      <div class='mt-4 text-sm text-slate-300'>Rating: ${item.rating}★</div>
    </div>
  </div>
</section>
<section class='mt-6 grid md:grid-cols-3 gap-3'>
  <div class='rounded-2xl border border-white/10 bg-[#111827] p-4'><h3 class='font-semibold mb-2'>What's Inside?</h3><p class='text-sm'>High‑quality materials, bright colors, and theme‑matched packaging.</p></div>
  <div class='rounded-2xl border border-white/10 bg-[#111827] p-4'><h3 class='font-semibold mb-2'>How to Use</h3><p class='text-sm'>Open, enjoy, and show it off.</p></div>
  <div class='rounded-2xl border border-white/10 bg-[#111827] p-4'><h3 class='font-semibold mb-2'>Reviews</h3><p class='text-sm'>“Looks amazing on stream!” — 4.8★</p></div>
</section>
<p class='mt-8'><a href='merch.html' class='underline'>← Back to Merch</a></p>`;}document.addEventListener('DOMContentLoaded', run);